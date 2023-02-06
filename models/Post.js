import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    isExpanded: {
      type: Boolean,
      required: true,
    },
    isChecked: {
      type: Boolean,
      required: true,
    },
    parentId: {
      type: String,
    },
    date: {
      type: Object,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, //дата создания юзера и обновление сущности
  },
);

export default mongoose.model('Post', PostSchema);