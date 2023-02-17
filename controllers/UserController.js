import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../models/User.js";
import UserSchema from "../models/User.js";
import PostSchema from "../models/Post.js";

export const register = async (req, res) => {
  try {
    const password = req.body.password.toString(); //достаем пароль
    const salt = await bcrypt.genSalt(10); // алгоритм шифрования пароля
    const passwordHash = await bcrypt.hash(password, salt); // храним зашифрованный пароль

    const doc = new UserModel({ // передам все что получаем с запроса на проверку
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash,
    })

    const user = await doc.save(); // сохраням документ в базе данных

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123', // ключ благодаря которому шифрую свой токен
      {
        expiresIn: '30d', // срок жизни токена
      },
    );

    res.json({
      ...user._doc,
      token
    }); // отправляем в ответ
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось зарегестрироваться',
    })
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const isValidPass = await bcrypt.compare('' + req.body.password, user._doc.passwordHash); // сравниваем пароли + приводим к строке
    if (!isValidPass) {
      return res.status(400).json({
        message: 'Не верный логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123', // ключ благодаря которому шифрую свой токен
      {
        expiresIn: '30d', // срок жизни токена
      },
    );

    res.json({
      ...user._doc,
      token
    }); // отправляем в ответ


  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    })
  }
}

export const getMe = async (req, res) => {
  const user = await UserModel.findById(req.userId);

  if (!user) {
    return res.status(404).json({
      message: 'Пользователь не найден',
    });
  }
  try {
    res.json({ ...user._doc });
  } catch (err) {
    return res.status(500).json({
      message: 'Нет доступа',
    });
  }
}

export const getAll = async (req, res) => {
  try {
    const users = await UserSchema.find();

    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    })
  }
}