import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import Registration from './models/Registration.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://bhuvaneshp23bec008_db_user:bhuvanesh@cluster0.wsyoefz.mongodb.net/ecsnova_registrations';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/uploads', express.static(uploadsDir));

app.post('/api/register', async (req, res) => {
  try {
    const { name, college_name, email, course_of_study, whatsapp_number, selected_events, transaction_id, payment_proof_url } = req.body;

    if (!name || !college_name || !email || !course_of_study || !whatsapp_number || !selected_events || !transaction_id || !payment_proof_url) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingRegistration = await Registration.findOne({ $or: [{ email }, { transaction_id }] });
    if (existingRegistration) {
      return res.status(400).json({ error: 'Email or transaction ID already registered' });
    }

    const registration = new Registration({
      name,
      college_name,
      email,
      course_of_study,
      whatsapp_number,
      selected_events,
      transaction_id,
      payment_proof_url
    });

    await registration.save();

    res.status(201).json({
      message: 'Registration successful',
      registration: {
        id: registration._id,
        email: registration.email,
        name: registration.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ error: `${field} already registered` });
    }
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().select('-payment_proof_url');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/registrations/:id', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.json(registration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
