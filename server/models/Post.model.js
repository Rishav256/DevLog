import mongoose from 'mongoose';
import slugify from 'slugify';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    readTime: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Auto-generate slug from title before saving
postSchema.pre('save', async function () {
  if (!this.isModified('title')) return;

  const baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  // Handle duplicate slugs
  while (
    await mongoose.model('Post').findOne({ slug, _id: { $ne: this._id } })
  ) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  this.slug = slug;
});

// Auto-calculate read time before saving
postSchema.pre('save', async function () {
  if (!this.isModified('content')) return;
  const wordsPerMinute = 200;
  const wordCount = this.content.trim().split(/\s+/).length;
  this.readTime = Math.ceil(wordCount / wordsPerMinute);
});

const Post = mongoose.model('Post', postSchema);
export default Post;
