import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DogIcon } from '../components/Icons';
import { useAuth } from '../utils/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/client');
      }
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link to="/" className="flex items-center justify-center gap-2 mb-6">
              <DogIcon size={40} />
              <span className="text-2xl font-bold">PawWalkers</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="alert alert-error">{error}</div>}

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <div className="text-center mt-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900">← Back to home</Link>
          </div>

          <div className="card mt-6" style={{ backgroundColor: 'var(--ion-color-primary-tint)', border: '1px solid var(--ion-color-primary-shade)' }}>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--ion-color-primary)' }}>Demo Credentials:</p>
            <p className="text-xs" style={{ color: 'var(--ion-color-primary-shade)' }}>Admin: admin@pawwalkers.com / admin123</p>
            <p className="text-xs" style={{ color: 'var(--ion-color-primary-shade)' }}>Client: client@example.com / client123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
