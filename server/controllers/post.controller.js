import Post from '../models/Post.model.js';

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { title, content, tags, status, coverImage } = req.body;

    const post = await Post.create({
      title,
      content,
      tags,
      status,
      coverImage,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all published posts (with pagination)
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { tag, search } = req.query;

    // Build query
    const query = { status: 'published' };

    if (tag) {
      query.tags = tag.toLowerCase();
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .populate('author', 'username avatar bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate(
      'author',
      'username avatar bio',
    );

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (author only)
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this post');
    }

    const { title, content, tags, status, coverImage } = req.body;

    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.tags = tags ?? post.tags;
    post.status = status ?? post.status;
    post.coverImage = coverImage ?? post.coverImage;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (author only)
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this post');
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Like or unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
export const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.status(200).json({
      likes: post.likes.length,
      liked: !alreadyLiked,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts by logged in user (dashboard)
// @route   GET /api/posts/my
// @access  Private
export const getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};
