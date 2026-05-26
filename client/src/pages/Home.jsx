import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/posts?page=${page}&limit=9`);
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0d1117', minHeight: '100vh' }}>
      {/* Hero */}
      {/* Hero */}
      <div
        style={{ borderBottom: '1px solid #30363d' }}
        className="px-8 py-24 text-center"
      >
        <div className="max-w-3xl mx-auto">
          <p
            style={{ color: '#10b981' }}
            className="font-mono text-xs mb-5 tracking-widest"
          >
            // a space for developers to think out loud
          </p>
          <h1
            style={{ color: '#e6edf3' }}
            className="font-mono text-5xl font-bold mb-5 tracking-tight"
          >
            Write. Share. Discover.
          </h1>
          <p
            style={{ color: '#8b949e' }}
            className="text-base mb-8 max-w-lg mx-auto leading-relaxed"
          >
            DevLog is where developers publish technical content, share what
            they're building, and learn from each other.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to={user ? '/write' : '/register'}
              style={{ backgroundColor: '#10b981', color: 'white' }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#059669')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#10b981')
              }
              className="font-mono text-sm font-medium px-6 py-2.5 rounded-md transition-colors"
            >
              start writing →
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

      {/* Posts grid */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2
            style={{ color: '#e6edf3' }}
            className="font-mono text-lg font-bold"
          >
            // recent posts
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#161b22',
                  border: '1px solid #30363d',
                }}
                className="rounded-md p-6 animate-pulse"
              >
                <div
                  style={{ backgroundColor: '#30363d' }}
                  className="h-4 rounded mb-3 w-3/4"
                />
                <div
                  style={{ backgroundColor: '#30363d' }}
                  className="h-3 rounded mb-2 w-full"
                />
                <div
                  style={{ backgroundColor: '#30363d' }}
                  className="h-3 rounded mb-2 w-2/3"
                />
                <div
                  style={{ backgroundColor: '#30363d' }}
                  className="h-3 rounded w-1/2 mt-4"
                />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p style={{ color: '#10b981' }} className="font-mono text-4xl mb-4">
              {'>'}_
            </p>
            <p style={{ color: '#8b949e' }} className="font-mono text-sm">
              no posts yet. be the first to write.
            </p>
            <Link
              to="/write"
              style={{ color: '#10b981' }}
              className="font-mono text-sm hover:underline mt-2 inline-block"
            >
              ~/write your first post →
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ color: '#8b949e', border: '1px solid #30363d' }}
                  className="font-mono text-sm px-4 py-2 rounded-md disabled:opacity-30 hover:border-accent transition-colors"
                >
                  ← prev
                </button>
                <span
                  style={{ color: '#8b949e' }}
                  className="font-mono text-sm"
                >
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{ color: '#8b949e', border: '1px solid #30363d' }}
                  className="font-mono text-sm px-4 py-2 rounded-md disabled:opacity-30 transition-colors"
                >
                  next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const PostCard = ({ post }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Link to={`/post/${post.slug}`}>
      <div
        style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#10b981')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#30363d')}
        className="rounded-md p-6 h-full flex flex-col transition-colors cursor-pointer"
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
          onMouseEnter={(e) => (e.currentTarget.style.color = '#10b981')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#e6edf3')}
          className="font-bold text-base mb-2 leading-snug transition-colors line-clamp-2"
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p
          style={{ color: '#8b949e' }}
          className="text-sm leading-relaxed line-clamp-2 mb-4 flex-1"
        >
          {post.content.replace(/<[^>]+>/g, '').substring(0, 120)}...
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div
              style={{
                backgroundColor: '#064e3b',
                border: '1px solid #10b981',
                width: '28px',
                height: '28px',
              }}
              className="rounded-full flex items-center justify-center"
            >
              <span
                style={{ color: '#10b981' }}
                className="font-mono text-xs font-bold"
              >
                {post.author.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <span style={{ color: '#8b949e' }} className="font-mono text-xs">
              {post.author.username}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ color: '#8b949e' }} className="font-mono text-xs">
              {post.readTime} min read
            </span>
            <span style={{ color: '#8b949e' }} className="font-mono text-xs">
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Home;
