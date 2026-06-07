import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../hooks/useAuth';
import { formatDate } from '../utils/formatDate';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/posts/my');
      setPosts(data);
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      setPosts(posts.filter((p) => p._id !== postId));
      toast.success('Post deleted', { duration: 1000 });
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  return (
    <div style={{ backgroundColor: '#0d1117', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p style={{ color: '#10b981' }} className="font-mono text-xs mb-1">
              // welcome back
            </p>
            <h1
              style={{ color: '#e6edf3' }}
              className="font-mono text-2xl font-bold"
            >
              {user?.username}
            </h1>
          </div>
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
            ~/write new post
          </Link>
        </div>

        {/* Stats bar */}
        <div
          style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
          className="rounded-md p-5 mb-8 grid grid-cols-3 gap-4"
        >
          <div className="text-center">
            <p
              style={{ color: '#10b981' }}
              className="font-mono text-2xl font-bold"
            >
              {posts.length}
            </p>
            <p style={{ color: '#8b949e' }} className="font-mono text-xs mt-1">
              total posts
            </p>
          </div>
          <div className="text-center">
            <p
              style={{ color: '#10b981' }}
              className="font-mono text-2xl font-bold"
            >
              {posts.filter((p) => p.status === 'published').length}
            </p>
            <p style={{ color: '#8b949e' }} className="font-mono text-xs mt-1">
              published
            </p>
          </div>
          <div className="text-center">
            <p
              style={{ color: '#10b981' }}
              className="font-mono text-2xl font-bold"
            >
              {posts.reduce((acc, p) => acc + p.likes.length, 0)}
            </p>
            <p style={{ color: '#8b949e' }} className="font-mono text-xs mt-1">
              total likes
            </p>
          </div>
        </div>

        {/* Posts table */}
        <div
          style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
          className="rounded-md overflow-hidden"
        >
          <div
            style={{ borderBottom: '1px solid #30363d' }}
            className="px-6 py-4 flex items-center justify-between"
          >
            <h2
              style={{ color: '#e6edf3' }}
              className="font-mono text-sm font-bold"
            >
              // my posts
            </h2>
            <span style={{ color: '#8b949e' }} className="font-mono text-xs">
              {posts.length} total
            </span>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  style={{ backgroundColor: '#0d1117' }}
                  className="h-12 rounded animate-pulse"
                />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center">
              <p
                style={{ color: '#8b949e' }}
                className="font-mono text-sm mb-3"
              >
                // no posts yet
              </p>
              <Link
                to="/write"
                style={{ color: '#10b981' }}
                className="font-mono text-sm hover:underline"
              >
                write your first post →
              </Link>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#30363d' }}>
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="px-6 py-4 flex items-center justify-between gap-4"
                >
                  {/* Title + meta */}
                  <div className="flex-1 min-w-0">
                    <p
                      style={{ color: '#e6edf3' }}
                      className="font-mono text-sm font-medium truncate mb-1"
                    >
                      {post.title}
                    </p>
                    <div className="flex items-center gap-3">
                      <span
                        style={{
                          backgroundColor:
                            post.status === 'published' ? '#064e3b' : '#1c1c1c',
                          color:
                            post.status === 'published' ? '#10b981' : '#8b949e',
                          border: `1px solid ${post.status === 'published' ? '#10b981' : '#30363d'}`,
                        }}
                        className="font-mono text-xs px-2 py-0.5 rounded"
                      >
                        {post.status}
                      </span>
                      <span
                        style={{ color: '#8b949e' }}
                        className="font-mono text-xs"
                      >
                        {formatDate(post.createdAt)}
                      </span>
                      <span
                        style={{ color: '#8b949e' }}
                        className="font-mono text-xs"
                      >
                        ♥ {post.likes.length}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 shrink-0">
                    <Link
                      to={`/post/${post.slug}`}
                      style={{ color: '#8b949e' }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = '#e6edf3')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = '#8b949e')
                      }
                      className="font-mono text-xs transition-colors"
                    >
                      // view
                    </Link>
                    <Link
                      to={`/edit/${post._id}`}
                      style={{ color: '#8b949e' }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = '#10b981')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = '#8b949e')
                      }
                      className="font-mono text-xs transition-colors"
                    >
                      // edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      style={{ color: '#8b949e' }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = '#f85149')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = '#8b949e')
                      }
                      className="font-mono text-xs transition-colors"
                    >
                      // delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
