import PostSchema from '../models/Post.js';
import UserSchema from "../models/User.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostSchema.find({ user: req.params.id }).populate('user').exec(); // передаем связь с юзером чтобы было видно информацию о нем

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
    console.log(req.body);
    for (let id of req.body) {
      console.log(id, req.body);
      PostSchema.findOneAndDelete(
        {
          _id: id,
        },
        (err, doc) => {
          if (err) {
            console.log(err);
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
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const updateTitle = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostSchema.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
      },
    );

    res.json({
      success: true
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    })
  }
}

export const updateIsExpanded = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostSchema.updateOne(
      {
        _id: postId,
      },
      {
        isExpanded: req.body.isExpanded,
      },
    );

    res.json({
      success: true
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    })
  }
}

export const updateIsChecked = async (req, res) => {
  try {
    for (let id of req.body.ids) {
      await PostSchema.updateOne(
        {
          _id: id,
        },
        {
          isChecked: req.body.isChecked,
        },
      );
    }

    res.json({
      success: true
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    })
  }
}

export const updateDate = async (req, res) => {
  try {
    const parentEl = req.params.id;

    await PostSchema.updateOne(
      {
        _id: parentEl,
      },
      {
        parentId: req.body.parentId,
      },
    );

    for (let id of req.body.ids) {
      await PostSchema.updateOne(
        {
          _id: id,
        },
        {
          date: req.body.date,
        },
      );
    }

    res.json({
      success: true
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    })
  }
}


export const updateParentId = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostSchema.updateOne(
      {
        _id: postId,
      },
      {
        parentId: req.body.parentId,
      },
    );

    res.json({
      success: true
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    })
  }
}

export const updatePosition = async (req, res) => {
  try {
    const parentEl = req.params.id;

    await PostSchema.updateOne(
      {
        _id: parentEl,
      },
      {
        parentId: req.body.parentId,
      },
    );

    for (let id of req.body.ids) {
      await PostSchema.updateOne(
        {
          _id: id,
        },
        {
          date: { current: req.body.currentTime },
        },
      );
    }

    res.json({
      success: true
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    })
  }
}
