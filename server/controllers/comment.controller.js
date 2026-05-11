import Comment from '../models/Comment.model.js';
import Post from '../models/Post.model.js';

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    if (post.status !== 'published') {
      res.status(403);
      throw new Error('Cannot comment on an unpublished post');
    }

    const comment = await Comment.create({
      postId: req.params.id,
      author: req.user._id,
      content: req.body.content,
    });

    const populated = await comment.populate('author', 'username avatar');

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all comments for a post
// @route   GET /api/posts/:id/comments
// @access  Public
export const getComments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Comment.countDocuments({ postId: req.params.id });

    const comments = await Comment.find({ postId: req.params.id })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      comments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalComments: total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (author or post owner)
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('postId');

    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    const isCommentAuthor =
      comment.author.toString() === req.user._id.toString();
    const isPostOwner =
      comment.postId.author.toString() === req.user._id.toString();

    if (!isCommentAuthor && !isPostOwner) {
      res.status(403);
      throw new Error('Not authorized to delete this comment');
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
