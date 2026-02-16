const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function uploadPaymentProof(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('File upload failed');
  }

  const data = await response.json();
  return data.url;
}

export async function submitRegistration(formData: {
  name: string;
  college_name: string;
  email: string;
  course_of_study: string;
  whatsapp_number: string;
  selected_events: string[];
  transaction_id: string;
  payment_proof_url: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  return response.json();
}
