/*
  # ECSNOVA Utsav 2026 Registration System

  1. New Tables
    - `registrations`
      - `id` (uuid, primary key) - Unique registration ID
      - `name` (text) - Participant name
      - `college_name` (text) - College/Institution name
      - `email` (text) - Email address
      - `course_of_study` (text) - Course/Degree
      - `whatsapp_number` (text) - WhatsApp contact number
      - `selected_events` (text[]) - Array of selected events
      - `transaction_id` (text) - Payment transaction ID
      - `payment_proof_url` (text) - URL to uploaded payment proof
      - `created_at` (timestamptz) - Registration timestamp

  2. Storage
    - Create `payment-proofs` bucket for PDF uploads

  3. Security
    - Enable RLS on `registrations` table
    - Allow public inserts for registrations
    - Only authenticated users (organizers) can read all registrations
*/

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  college_name text NOT NULL,
  email text NOT NULL,
  course_of_study text NOT NULL,
  whatsapp_number text NOT NULL,
  selected_events text[] NOT NULL,
  transaction_id text NOT NULL,
  payment_proof_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert registrations (public registration)
CREATE POLICY "Anyone can register"
  ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all registrations (organizer dashboard)
CREATE POLICY "Authenticated users can view all registrations"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Allow public uploads to payment-proofs bucket
CREATE POLICY "Anyone can upload payment proofs"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'payment-proofs');

-- Allow authenticated users to read payment proofs
CREATE POLICY "Authenticated users can view payment proofs"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'payment-proofs');