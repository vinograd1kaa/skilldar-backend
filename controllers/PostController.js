import PostSchema from '../models/Post.js';
import {getSubTasksId} from "../utils/getSubTasksId.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostSchema.find({ user: req.params.id }).populate('user').exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostSchema({
      title: req.body.title,
      isChecked: req.body.isChecked,
      isExpanded: req.body.isExpanded,
      parentId: req.body.parentId,
      date: req.body.date,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;

    const allPosts = await PostSchema.find().populate('user').exec();
    const subPosts = getSubTasksId(allPosts, id) || [id];

    if (subPosts) {
      for (let id of subPosts) {
        await PostSchema.findOneAndDelete(
          {
            _id: id,
          },
          (err, doc) => {
            if (err) {
              return res.status(500).json({
                message: 'Не удалось удалить статью',
              });
            }

            if (!doc) {
              return res.status(404).json({
                message: 'Статья не найдена',
              });
            }
          },
        );
      }
      return res.json({
        success: true
      })
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить статьи',
    });
  }
};

export const handlePostUpdate = async (req, res) => {
  try {
    const id = req.params.id;
    const newPost = req.body.values;

    if (req.body.hasOwnProperty('changeParentId')) {
      await PostSchema.findOneAndUpdate({_id: req.params.id}, {parentId: req.body.changeParentId}, {new: true});
    }

    const allPosts = await PostSchema.find().populate('user').exec();
    const subPosts = getSubTasksId(allPosts, id) || [id];

    if (subPosts) {
      for (let id of subPosts) {
        await PostSchema.findOneAndUpdate({_id: id}, newPost, {new: true});
      }
      return res.json({
        success: true
      })
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статьи',
    });
  }
};
