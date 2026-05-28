import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../hooks/useAuth';

const ProfilePage = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/users/${username}`);
      setProfile(data);
    } catch (error) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div
        style={{ backgroundColor: '#0d1117', minHeight: '100vh' }}
        className="flex items-center justify-center"
      >
        <p
          style={{ color: '#10b981' }}
          className="font-mono text-sm animate-pulse"
        >
          // loading profile...
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        style={{ backgroundColor: '#0d1117', minHeight: '100vh' }}
        className="flex items-center justify-center"
      >
        <div className="text-center">
          <p style={{ color: '#10b981' }} className="font-mono text-4xl mb-4">
            {'>'}_
          </p>
          <p style={{ color: '#8b949e' }} className="font-mono text-sm">
            // user not found
          </p>
          <Link
            to="/"
            style={{ color: '#10b981' }}
            className="font-mono text-sm hover:underline mt-2 inline-block"
          >
            ~/home →
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.username === profile.username;

  return (
    <div style={{ backgroundColor: '#0d1117', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile header */}
        <div
          style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
          className="rounded-md p-8 mb-8"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div
                style={{
                  backgroundColor: '#064e3b',
                  border: '2px solid #10b981',
                  width: '72px',
                  height: '72px',
                }}
                className="rounded-full flex items-center justify-center shrink-0"
              >
                <span
                  style={{ color: '#10b981' }}
                  className="font-mono text-2xl font-bold"
                >
                  {profile.username.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div>
                <h1
                  style={{ color: '#e6edf3' }}
                  className="font-mono text-2xl font-bold mb-1"
                >
                  {profile.username}
                </h1>
                {profile.bio && (
                  <p
                    style={{ color: '#8b949e' }}
                    className="text-sm mb-2 max-w-md"
                  >
                    {profile.bio}
                  </p>
                )}
                <p style={{ color: '#8b949e' }} className="font-mono text-xs">
                  // joined {formatDate(profile.createdAt)}
                </p>
              </div>
            </div>

            {/* Edit profile button — only for own profile */}
            {isOwnProfile && (
              <Link
                to="/settings"
                style={{ color: '#8b949e', border: '1px solid #30363d' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#e6edf3';
                  e.currentTarget.style.borderColor = '#8b949e';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#8b949e';
                  e.currentTarget.style.borderColor = '#30363d';
                }}
                className="font-mono text-xs px-4 py-2 rounded-md transition-colors shrink-0"
              >
                // edit profile
              </Link>
            )}
          </div>

          {/* Stats */}
          <div
            style={{ borderTop: '1px solid #30363d' }}
            className="flex items-center gap-8 mt-6 pt-6"
          >
            <div>
              <p
                style={{ color: '#10b981' }}
                className="font-mono text-xl font-bold"
              >
                {profile.posts.length}
              </p>
              <p
                style={{ color: '#8b949e' }}
                className="font-mono text-xs mt-0.5"
              >
                posts
              </p>
            </div>
            <div>
              <p
                style={{ color: '#10b981' }}
                className="font-mono text-xl font-bold"
              >
                {profile.posts.reduce((acc, p) => acc + p.likes.length, 0)}
              </p>
              <p
                style={{ color: '#8b949e' }}
                className="font-mono text-xs mt-0.5"
              >
                total likes
              </p>
            </div>
          </div>
        </div>

        {/* Posts */}
        <h2
          style={{ color: '#e6edf3' }}
          className="font-mono text-sm font-bold mb-4"
        >
          // posts by {profile.username}
        </h2>

        {profile.posts.length === 0 ? (
          <div
            style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
            className="rounded-md p-12 text-center"
          >
            <p style={{ color: '#8b949e' }} className="font-mono text-sm">
              // no published posts yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.posts.map((post) => (
              <Link to={`/post/${post.slug}`} key={post._id}>
                <div
                  style={{
                    backgroundColor: '#161b22',
                    border: '1px solid #30363d',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = '#10b981')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = '#30363d')
                  }
                  className="rounded-md p-5 transition-colors"
                >
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        style={{
                          backgroundColor: '#064e3b',
                          color: '#10b981',
                          border: '1px solid #10b981',
                        }}
                        className="font-mono text-xs px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3
                    style={{ color: '#e6edf3' }}
                    className="font-mono text-sm font-bold mb-2 leading-snug line-clamp-2"
                  >
                    {post.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mt-3">
                    <span
                      style={{ color: '#8b949e' }}
                      className="font-mono text-xs"
                    >
                      {post.readTime} min read
                    </span>
                    <span
                      style={{ color: '#8b949e' }}
                      className="font-mono text-xs"
                    >
                      ♥ {post.likes.length}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
