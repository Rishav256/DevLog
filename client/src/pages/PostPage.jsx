import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../hooks/useAuth';
import { formatDate } from '../utils/formatDate';

const PostPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/posts/${slug}`);
      setPost(data);
      setLikeCount(data.likes.length);
      setLiked(user ? data.likes.includes(user._id) : false);
      fetchComments(data._id);
    } catch (error) {
      toast.error('Post not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const { data } = await axiosInstance.get(`/posts/${postId}/comments`);
      setComments(data.comments);
    } catch (error) {
      console.error('Failed to fetch comments');
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Sign in to like posts');
      return;
    }
    try {
      const { data } = await axiosInstance.put(`/posts/${post._id}/like`);
      setLiked(data.liked);
      setLikeCount(data.likes);
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Sign in to comment');
      return;
    }
    if (!commentText.trim()) return;

    setCommentLoading(true);
    try {
      const { data } = await axiosInstance.post(`/posts/${post._id}/comments`, {
        content: commentText,
      });
      setComments([data, ...comments]);
      setCommentText('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success('Comment deleted', { duration: 1000 });
    } catch (error) {
      toast.error('Failed to delete comment');
    }
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
          // loading post...
        </p>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div style={{ backgroundColor: '#0d1117', minHeight: '100vh' }}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
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
        <h1
          style={{ color: '#e6edf3' }}
          className="text-4xl font-bold mb-6 leading-tight"
        >
          {post.title}
        </h1>

        {/* Author bar */}
        <div
          style={{
            borderTop: '1px solid #30363d',
            borderBottom: '1px solid #30363d',
          }}
          className="flex items-center justify-between py-4 mb-8"
        >
          <Link
            to={`/profile/${post.author.username}`}
            className="flex items-center gap-3"
          >
            <div
              style={{
                backgroundColor: '#064e3b',
                border: '2px solid #10b981',
                width: '40px',
                height: '40px',
              }}
              className="rounded-full flex items-center justify-center"
            >
              <span
                style={{ color: '#10b981' }}
                className="font-mono text-sm font-bold"
              >
                {post.author.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p
                style={{ color: '#e6edf3' }}
                className="font-mono text-sm font-medium"
              >
                {post.author.username}
              </p>
              <p style={{ color: '#8b949e' }} className="font-mono text-xs">
                {formatDate(post.createdAt)} · {post.readTime} min read
              </p>
            </div>
          </Link>

          {/* Like button */}
          <button
            onClick={handleLike}
            style={{
              color: liked ? '#10b981' : '#8b949e',
              border: `1px solid ${liked ? '#10b981' : '#30363d'}`,
              backgroundColor: liked ? '#064e3b' : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!liked) e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              if (!liked) e.currentTarget.style.borderColor = '#30363d';
            }}
            className="flex items-center gap-2 font-mono text-sm px-4 py-1.5 rounded-md transition-colors"
          >
            <span className="text-lg">{liked ? '♥' : '♡'}</span>
            <span>{likeCount}</span>
          </button>
        </div>

        {/* Content */}
        <div
          style={{ color: '#e6edf3' }}
          className="prose prose-invert max-w-none mb-12 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Comments section */}
        <div style={{ borderTop: '1px solid #30363d' }} className="pt-8">
          <h2
            style={{ color: '#e6edf3' }}
            className="font-mono text-base font-bold mb-6"
          >
            // {comments.length} comment{comments.length !== 1 ? 's' : ''}
          </h2>

          {/* Comment form */}
          {user ? (
            <form onSubmit={handleComment} className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="// leave a comment..."
                rows={3}
                style={{
                  backgroundColor: '#161b22',
                  border: '1px solid #30363d',
                  color: '#e6edf3',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#10b981')}
                onBlur={(e) => (e.target.style.borderColor = '#30363d')}
                className="w-full font-mono text-sm px-4 py-3 rounded-md resize-none placeholder-gray-600 focus:outline-none transition-colors"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={commentLoading || !commentText.trim()}
                  style={{ backgroundColor: '#10b981', color: 'white' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#059669')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '#10b981')
                  }
                  className="font-mono text-sm px-5 py-2 rounded-md disabled:opacity-40 transition-colors"
                >
                  {commentLoading ? '// posting...' : '// post comment'}
                </button>
              </div>
            </form>
          ) : (
            <div
              style={{
                backgroundColor: '#161b22',
                border: '1px solid #30363d',
              }}
              className="rounded-md p-4 mb-8 text-center"
            >
              <p style={{ color: '#8b949e' }} className="font-mono text-sm">
                <Link
                  to="/login"
                  style={{ color: '#10b981' }}
                  className="hover:underline"
                >
                  sign in
                </Link>{' '}
                to join the discussion
              </p>
            </div>
          )}

          {/* Comments list */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment._id}
                style={{
                  backgroundColor: '#161b22',
                  border: '1px solid #30363d',
                }}
                className="rounded-md p-4"
              >
                <div className="flex items-center justify-between mb-2">
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
                        {comment.author.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span
                      style={{ color: '#e6edf3' }}
                      className="font-mono text-xs font-medium"
                    >
                      {comment.author.username}
                    </span>
                    <span
                      style={{ color: '#8b949e' }}
                      className="font-mono text-xs"
                    >
                      · {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  {user && user._id === comment.author._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
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
                  )}
                </div>
                <p
                  style={{ color: '#8b949e' }}
                  className="font-mono text-sm leading-relaxed"
                >
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
