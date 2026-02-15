import { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import OrganizerDashboard from './components/OrganizerDashboard';
import { Shield, Home } from 'lucide-react';

function App() {
  const [view, setView] = useState<'home' | 'organizer'>('home');

  return (
    <div className="min-h-screen">
      <nav className="fixed top-4 right-4 z-50 flex gap-2">
        {view === 'organizer' && (
          <button
            onClick={() => setView('home')}
            className="flex items-center space-x-2 bg-white shadow-lg hover:shadow-xl px-4 py-2 rounded-full font-semibold text-gray-700 hover:text-blue-600 transition-all"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
        )}
        {view === 'home' && (
          <button
            onClick={() => setView('organizer')}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:shadow-xl px-4 py-2 rounded-full font-semibold text-white transition-all"
          >
            <Shield className="w-5 h-5" />
            <span>Organizer</span>
          </button>
        )}
      </nav>

      {view === 'home' ? <RegistrationForm /> : <OrganizerDashboard />}
    </div>
  );
}

export default App;
