import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div
      style={{ backgroundColor: '#0d1117', minHeight: '100vh' }}
      className="flex items-center justify-center px-6"
    >
      <div className="text-center">
        <p
          style={{ color: '#10b981' }}
          className="font-mono text-8xl font-bold mb-4"
        >
          404
        </p>
        <p
          style={{ color: '#30363d' }}
          className="font-mono text-6xl font-bold mb-8"
        >
          ___
        </p>
        <p style={{ color: '#8b949e' }} className="font-mono text-sm mb-2">
          // page not found
        </p>
        <p style={{ color: '#8b949e' }} className="font-mono text-xs mb-8">
          the path you're looking for doesn't exist
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            style={{ backgroundColor: '#10b981', color: 'white' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#059669')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#10b981')
            }
            className="font-mono text-sm font-medium px-6 py-2.5 rounded-md transition-colors"
          >
            ~/home →
          </Link>
          <Link
            to="/explore"
            style={{ color: '#8b949e', border: '1px solid #30363d' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#e6edf3';
              e.currentTarget.style.borderColor = '#8b949e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#8b949e';
              e.currentTarget.style.borderColor = '#30363d';
            }}
            className="font-mono text-sm font-medium px-6 py-2.5 rounded-md transition-colors"
          >
            ~/explore
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
