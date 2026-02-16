import { useState } from 'react';
import { submitRegistration, uploadPaymentProof } from '../services/api';
import { Calendar, MapPin, Award, Upload, CheckCircle } from 'lucide-react';

const EVENTS = [
  'Paper Presentation',
  'Poster Presentation',
  'Circuit Debugging',
  'Electronic Genius',
  'Quiz',
  'Project Presentation',
];

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    college_name: '',
    email: '',
    course_of_study: '',
    whatsapp_number: '',
    selected_events: [] as string[],
    transaction_id: '',
  });
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  const handleEventToggle = (event: string) => {
    setFormData((prev) => ({
      ...prev,
      selected_events: prev.selected_events.includes(event)
        ? prev.selected_events.filter((e) => e !== event)
        : [...prev.selected_events, event],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.selected_events.length === 0) {
        throw new Error('Please select at least one event');
      }

      if (!paymentProof) {
        throw new Error('Please upload payment proof');
      }

      const paymentProofUrl = await uploadPaymentProof(paymentProof);

      await submitRegistration({
        ...formData,
        payment_proof_url: paymentProofUrl,
      });

      setSuccess(true);
      setFormData({
        name: '',
        college_name: '',
        email: '',
        course_of_study: '',
        whatsapp_number: '',
        selected_events: [],
        transaction_id: '',
      });
      setPaymentProof(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for registering for ECSNOVA Utsav 2026. You will receive a confirmation email shortly.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Register Another Participant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
            <div className="flex items-center justify-center mb-6">
              <img
                src="/skasc.jpg"
                alt="SKASC Logo"
                className="h-24 w-24 object-contain bg-white rounded-full p-2"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
              ECSNOVA Utsav 2026
            </h1>
            <p className="text-xl text-center mb-6">
              One Day Intercollegiate Technical Symposium
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>February 27, 2026</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Seminar Hall-1</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Attractive Prizes</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 border-l-4 border-orange-500 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-bold text-orange-800 mb-3">About ECSNOVA Utsav</h3>
              <p className="text-orange-900">
                Our event features technical excellence across six major competitions. All participants are welcome to showcase their skills and innovation in this premier technical symposium at Sri Krishna Arts and Science College.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    College Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.college_name}
                    onChange={(e) =>
                      setFormData({ ...formData, college_name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                    placeholder="Enter your college name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course of Study *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.course_of_study}
                    onChange={(e) =>
                      setFormData({ ...formData, course_of_study: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                    placeholder="e.g., B.E. ECE, B.Tech CSE"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.whatsapp_number}
                    onChange={(e) =>
                      setFormData({ ...formData, whatsapp_number: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Events * (You can select multiple)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {EVENTS.map((event) => (
                    <label
                      key={event}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.selected_events.includes(event)
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-300 hover:border-purple-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selected_events.includes(event)}
                        onChange={() => handleEventToggle(event)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="ml-3 font-medium text-gray-700">{event}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-6">Payment Information</h3>

                <div className="bg-white rounded-lg p-6 mb-6 border-2 border-orange-200">
                  <div className="mb-4">
                    <h4 className="text-2xl font-bold text-orange-600 mb-2">Registration and Fee</h4>
                    <p className="text-2xl font-bold text-blue-900 mb-4">Rs. 250 per student</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-start border-b pb-2">
                      <span className="font-bold text-gray-800">Account Name</span>
                      <span className="text-gray-700 text-right">Sri Krishna Arts and Science College</span>
                    </div>
                    <div className="flex justify-between items-start border-b pb-2">
                      <span className="font-bold text-gray-800">Account Number</span>
                      <span className="text-gray-700 text-right">31128406279</span>
                    </div>
                    <div className="flex justify-between items-start border-b pb-2">
                      <span className="font-bold text-gray-800">IFSC Code</span>
                      <span className="text-gray-700 text-right">SBIN0012245</span>
                    </div>
                    <div className="flex justify-between items-start border-b pb-2">
                      <span className="font-bold text-gray-800">Bank Name</span>
                      <span className="text-gray-700 text-right">State Bank of India</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-gray-800">Branch</span>
                      <span className="text-gray-700 text-right">Kuniamuthur</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPaymentInfo(!showPaymentInfo)}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                  >
                    {showPaymentInfo ? '▼ Hide' : '▶ Show'} Full Payment Details Image
                  </button>

                  {showPaymentInfo && (
                    <div className="mt-4">
                      <img
                        src="/Registration_Fee.JPG"
                        alt="Payment Details"
                        className="w-full rounded-lg shadow-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Transaction ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.transaction_id}
                      onChange={(e) =>
                        setFormData({ ...formData, transaction_id: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                      placeholder="Enter transaction ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Proof (PDF) *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf"
                        required
                        onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                      />
                      <Upload className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Complete Registration'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
