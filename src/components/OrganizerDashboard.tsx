import { useState, useEffect } from 'react';
import { LogOut, Download, Eye, Users, Calendar } from 'lucide-react';

interface Registration {
  _id: string;
  name: string;
  college_name: string;
  email: string;
  course_of_study: string;
  whatsapp_number: string;
  selected_events: string[];
  transaction_id: string;
  payment_proof_url: string;
  created_at: string;
}

const ORGANIZER_PASSWORD = 'ecs nova';

export default function OrganizerDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

  useEffect(() => {
    if (authenticated) {
      fetchRegistrations();
    }
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ORGANIZER_PASSWORD) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/registrations`);

      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }

      const data = await response.json();
      const sorted = data.sort((a: Registration, b: Registration) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setRegistrations(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Name',
      'College',
      'Email',
      'Course',
      'WhatsApp',
      'Events',
      'Transaction ID',
      'Registration Date',
    ];

    const rows = registrations.map((reg) => [
      reg.name,
      reg.college_name,
      reg.email,
      reg.course_of_study,
      reg.whatsapp_number,
      reg.selected_events.join('; '),
      reg.transaction_id,
      new Date(reg.created_at).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecsnova_registrations_${new Date().toISOString()}.csv`;
    a.click();
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Organizer Login</h2>
            <p className="text-gray-600">ECSNOVA Utsav 2026 Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                placeholder="Enter organizer password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-bold hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Organizer Dashboard</h1>
                <p className="text-purple-100">ECSNOVA Utsav 2026 Registrations</p>
              </div>
              <button
                onClick={() => setAuthenticated(false)}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Total Registrations</p>
                    <p className="text-4xl font-bold">{registrations.length}</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm mb-1">Event Date</p>
                    <p className="text-2xl font-bold">Feb 27, 2026</p>
                  </div>
                  <Calendar className="w-12 h-12 text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6">
                <button
                  onClick={exportToCSV}
                  disabled={registrations.length === 0}
                  className="flex items-center justify-center space-x-2 w-full h-full text-white font-bold hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Download className="w-6 h-6" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading registrations...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                        College
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                        WhatsApp
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                        Events
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg, index) => (
                      <tr
                        key={reg._id}
                        className={`border-b ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } hover:bg-blue-50 transition-colors`}
                      >
                        <td className="px-4 py-4 text-sm text-gray-900">{reg.name}</td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {reg.college_name}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">{reg.email}</td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {reg.whatsapp_number}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex flex-wrap gap-1">
                            {reg.selected_events.map((event) => (
                              <span
                                key={event}
                                className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs"
                              >
                                {event}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => setSelectedRegistration(reg)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {registrations.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No registrations yet
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
              <h3 className="text-2xl font-bold">Registration Details</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Name</label>
                  <p className="text-gray-900 font-medium">{selectedRegistration.name}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">College</label>
                  <p className="text-gray-900 font-medium">
                    {selectedRegistration.college_name}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-gray-900 font-medium">{selectedRegistration.email}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Course of Study
                  </label>
                  <p className="text-gray-900 font-medium">
                    {selectedRegistration.course_of_study}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    WhatsApp Number
                  </label>
                  <p className="text-gray-900 font-medium">
                    {selectedRegistration.whatsapp_number}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Transaction ID
                  </label>
                  <p className="text-gray-900 font-medium">
                    {selectedRegistration.transaction_id}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">
                  Selected Events
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedRegistration.selected_events.map((event) => (
                    <span
                      key={event}
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {event}
                    </span>
                  ))}
                </div>
              </div>

              {selectedRegistration.payment_proof_url && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">
                    Payment Proof
                  </label>
                  <a
                    href={selectedRegistration.payment_proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>View Payment Proof</span>
                  </a>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Registration Date
                </label>
                <p className="text-gray-900 font-medium">
                  {new Date(selectedRegistration.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedRegistration(null)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
