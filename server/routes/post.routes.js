import express from 'express';
import {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  toggleLike,
  getMyPosts,
} from '../controllers/post.controller.js';
import { addComment, getComments } from '../controllers/comment.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/my', protect, getMyPosts);
router.get('/:slug', getPostBySlug);
router.post('/', protect, createPost);
router.put('/:id/like', protect, toggleLike);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

// Comment routes scoped to a post
router.get('/:id/comments', getComments);
router.post('/:id/comments', protect, addComment);

export default router;
