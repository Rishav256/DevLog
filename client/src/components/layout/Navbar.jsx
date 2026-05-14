import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out', { duration: 1000 });
    navigate('/');
  };

  return (
    <nav
      style={{ backgroundColor: '#161b22', borderBottom: '1px solid #30363d' }}
      className="sticky top-0 z-50"
    >
      <div className="px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center">
          <span
            style={{ color: '#10b981' }}
            className="font-mono text-2xl font-bold"
          >
            &gt;
          </span>
          <span
            style={{ color: '#10b981' }}
            className="font-mono text-2xl font-bold cursor-blink mr-2"
          >
            _
          </span>
          <span
            style={{ color: '#e6edf3' }}
            className="font-mono text-2xl font-bold tracking-tight"
          >
            DevLog
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-7">
          <Link
            to="/explore"
            style={{ color: '#8b949e' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#10b981')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8b949e')}
            className="font-mono text-sm transition-colors"
          >
            ~/explore
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                style={{ color: '#8b949e' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#10b981')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8b949e')}
                className="font-mono text-sm transition-colors"
              >
                ~/dashboard
              </Link>
              <Link
                to={`/profile/${user.username}`}
                style={{ color: '#8b949e' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#10b981')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8b949e')}
                className="font-mono text-sm transition-colors"
              >
                ~/profile
              </Link>
              <Link
                to="/write"
                style={{
                  backgroundColor: '#064e3b',
                  color: '#10b981',
                  border: '1px solid #10b981',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#10b981';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#064e3b';
                  e.currentTarget.style.color = '#10b981';
                }}
                className="font-mono text-sm font-medium px-5 py-2 rounded-md transition-colors"
              >
                ~/write
              </Link>

              {/* Divider */}
              <div
                style={{
                  width: '1px',
                  height: '20px',
                  backgroundColor: '#30363d',
                }}
              />

              <button
                onClick={handleLogout}
                style={{ color: '#8b949e' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#f85149')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8b949e')}
                className="font-mono text-sm transition-colors"
              >
                logout
              </button>
              <Link to={`/profile/${user.username}`}>
                <div
                  style={{
                    backgroundColor: '#064e3b',
                    border: '2px solid #10b981',
                    width: '52px',
                    height: '52px',
                  }}
                  className="rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  <span
                    style={{ color: '#10b981' }}
                    className="text-lg font-mono font-bold"
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{ color: '#8b949e' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#10b981')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8b949e')}
                className="font-mono text-sm transition-colors"
              >
                ~/login
              </Link>
              <Link
                to="/register"
                style={{ backgroundColor: '#10b981', color: 'white' }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#059669')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = '#10b981')
                }
                className="font-mono text-sm font-medium px-5 py-2 rounded-md transition-colors"
              >
                register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
