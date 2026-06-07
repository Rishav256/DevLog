import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { formatDate } from '../utils/formatDate';

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [page, activeTag]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let url = `/posts?page=${page}&limit=9`;
      if (activeTag) url += `&tag=${activeTag}`;
      if (search.trim()) url += `&search=${search.trim()}`;
      const { data } = await axiosInstance.get(url);
      setPosts(data.posts);
      setTotalPages(data.totalPages);
      setTotalPosts(data.totalPosts);
    } catch (error) {
      console.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  const handleTagClick = (tag) => {
    setActiveTag(activeTag === tag ? '' : tag);
    setPage(1);
  };

  const popularTags = [
    'nodejs',
    'react',
    'mongodb',
    'javascript',
    'css',
    'python',
    'devops',
    'typescript',
  ];
  return (
    <div style={{ backgroundColor: '#0d1117', minHeight: '100vh' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <p style={{ color: '#10b981' }} className="font-mono text-xs mb-1">
            // discover content
          </p>
          <h1
            style={{ color: '#e6edf3' }}
            className="font-mono text-2xl font-bold"
          >
            explore
          </h1>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="// search posts..."
              style={{
                backgroundColor: '#161b22',
                border: '1px solid #30363d',
                color: '#e6edf3',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#10b981')}
              onBlur={(e) => (e.target.style.borderColor = '#30363d')}
              className="flex-1 font-mono text-sm px-4 py-2.5 rounded-md placeholder-gray-600 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              style={{ backgroundColor: '#10b981', color: 'white' }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#059669')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#10b981')
              }
              className="font-mono text-sm px-5 py-2.5 rounded-md transition-colors"
            >
              // search
            </button>
          </div>
        </form>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              style={{
                backgroundColor: activeTag === tag ? '#064e3b' : 'transparent',
                color: activeTag === tag ? '#10b981' : '#8b949e',
                border: `1px solid ${activeTag === tag ? '#10b981' : '#30363d'}`,
              }}
              onMouseEnter={(e) => {
                if (activeTag !== tag)
                  e.currentTarget.style.borderColor = '#10b981';
              }}
              onMouseLeave={(e) => {
                if (activeTag !== tag)
                  e.currentTarget.style.borderColor = '#30363d';
              }}
              className="font-mono text-xs px-3 py-1 rounded transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p style={{ color: '#8b949e' }} className="font-mono text-xs mb-6">
            // {totalPosts} post{totalPosts !== 1 ? 's' : ''} found
            {activeTag && ` · filtered by #${activeTag}`}
          </p>
        )}

        {/* Posts grid */}
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
                  className="h-3 rounded w-2/3"
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
              // no posts found
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
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
                    className="rounded-md p-6 h-full flex flex-col transition-colors"
                  >
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleTagClick(tag);
                          }}
                          style={{
                            backgroundColor: '#064e3b',
                            color: '#10b981',
                            border: '1px solid #10b981',
                          }}
                          className="font-mono text-xs px-2 py-0.5 rounded cursor-pointer hover:opacity-80"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h3
                      style={{ color: '#e6edf3' }}
                      className="font-bold text-base mb-2 leading-snug line-clamp-2"
                    >
                      {post.title}
                    </h3>
                    <p
                      style={{ color: '#8b949e' }}
                      className="text-sm leading-relaxed line-clamp-2 mb-4 flex-1"
                    >
                      {post.content.replace(/<[^>]+>/g, '').substring(0, 120)}
                      ...
                    </p>
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
                        <span
                          style={{ color: '#8b949e' }}
                          className="font-mono text-xs"
                        >
                          {post.author.username}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
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
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ color: '#8b949e', border: '1px solid #30363d' }}
                  className="font-mono text-sm px-4 py-2 rounded-md disabled:opacity-30 transition-colors"
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

export default ExplorePage;
