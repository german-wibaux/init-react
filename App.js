import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './screens/LoginScreen';
import { login, logout } from './services/authService';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  const handleLogin = async () => {
    const nextEmail = email.trim().toLowerCase();
    const nextPassword = password.trim();

    if (!nextEmail || !nextPassword) {
      setError('Completá email y contraseña.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login({
        email: nextEmail,
        password: nextPassword,
      });
      setSession(result);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setSession(null);
    setPassword('');
    setError('');
  };

  return (
    <>
      <LoginScreen
        email={email}
        password={password}
        error={error}
        loading={loading}
        session={session}
        onChangeEmail={setEmail}
        onChangePassword={setPassword}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <StatusBar style="light" />
    </>
  );
}
