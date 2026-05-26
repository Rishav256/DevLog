import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import MDEditor from '@uiw/react-md-editor';
import axiosInstance from '../api/axiosInstance';

const WritePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    status: 'draft',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isEditing) fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setFetching(true);
      const { data } = await axiosInstance.get(`/posts/${id}`);
      setFormData({
        title: data.title,
        content: data.content,
        tags: data.tags.join(', '),
        status: data.status,
      });
    } catch (error) {
      toast.error('Failed to load post');
      navigate('/dashboard');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (status) => {
    if (!formData.title.trim()) {
      toast.error('Title is required', { duration: 1000 });
      return;
    }
    if (!formData.content.trim()) {
      toast.error('Content is required', { duration: 1000 });
      return;
    }

    const tags = formData.tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const payload = {
      title: formData.title,
      content: formData.content,
      tags,
      status,
    };

    setLoading(true);
    try {
      if (isEditing) {
        await axiosInstance.put(`/posts/${id}`, payload);
        toast.success(
          status === 'published' ? 'Post published' : 'Draft saved',
        );
      } else {
        const { data } = await axiosInstance.post('/posts', payload);
        toast.success(
          status === 'published' ? 'Post published' : 'Draft saved',
        );
        navigate(`/post/${data.slug}`);
      }
      if (status === 'published') navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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

  return (
    <div style={{ backgroundColor: '#0d1117', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p style={{ color: '#10b981' }} className="font-mono text-xs mb-1">
              {isEditing ? '// editing post' : '// new post'}
            </p>
            <h1
              style={{ color: '#e6edf3' }}
              className="font-mono text-2xl font-bold"
            >
              {isEditing ? 'edit post' : 'write something'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSubmit('draft')}
              disabled={loading}
              style={{ color: '#8b949e', border: '1px solid #30363d' }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = '#8b949e')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = '#30363d')
              }
              className="font-mono text-sm px-5 py-2 rounded-md disabled:opacity-40 transition-colors"
            >
              // save draft
            </button>
            <button
              onClick={() => handleSubmit('published')}
              disabled={loading}
              style={{ backgroundColor: '#10b981', color: 'white' }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#059669')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#10b981')
              }
              className="font-mono text-sm px-5 py-2 rounded-md disabled:opacity-40 transition-colors"
            >
              {loading ? '// publishing...' : '// publish'}
            </button>
          </div>
        </div>

        {/* Title */}
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="// post title"
          style={{
            backgroundColor: '#161b22',
            border: '1px solid #30363d',
            color: '#e6edf3',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#10b981')}
          onBlur={(e) => (e.target.style.borderColor = '#30363d')}
          className="w-full font-mono text-2xl font-bold px-4 py-3 rounded-md placeholder-gray-600 focus:outline-none transition-colors mb-4"
        />

        {/* Tags */}
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="// tags — comma separated (nodejs, react, mongodb)"
          style={{
            backgroundColor: '#161b22',
            border: '1px solid #30363d',
            color: '#e6edf3',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#10b981')}
          onBlur={(e) => (e.target.style.borderColor = '#30363d')}
          className="w-full font-mono text-sm px-4 py-3 rounded-md placeholder-gray-600 focus:outline-none transition-colors mb-6"
        />

        {/* Editor */}
        <div data-color-mode="dark">
          <MDEditor
            value={formData.content}
            onChange={(val) => setFormData({ ...formData, content: val || '' })}
            height={500}
            preview="live"
            style={{ backgroundColor: '#161b22' }}
          />
        </div>
      </div>
    </div>
  );
};

export default WritePage;
