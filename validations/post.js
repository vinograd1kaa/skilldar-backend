import { body } from "express-validator";

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 1 }).isString(),
  body('isChecked', 'Введите состояние isChecked статьи').isBoolean(),
  body('isExpanded', 'Введите состояние isExpanded статьи').isBoolean(),
  body('parentId', 'Введите id родителя статьи'),
  body('date', 'Введите поле даты current и time').isObject(),
];
