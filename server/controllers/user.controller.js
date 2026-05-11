import User from '../models/User.model.js';
import Post from '../models/Post.model.js';

// @desc    Get user public profile + their published posts
// @route   GET /api/users/:username
// @access  Public
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const posts = await Post.find({
      author: user._id,
      status: 'published',
    }).sort({ createdAt: -1 });

    res.status(200).json({
      _id: user._id,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const { username, bio, avatar } = req.body;

    // Check if new username is taken by someone else
    if (username && username !== user.username) {
      const taken = await User.findOne({ username });
      if (taken) {
        res.status(400);
        throw new Error('Username already taken');
      }
    }

    user.username = username ?? user.username;
    user.bio = bio ?? user.bio;
    user.avatar = avatar ?? user.avatar;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
    });
  } catch (error) {
    next(error);
  }
};
