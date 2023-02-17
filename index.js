import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import { loginValidation, registerValidation } from "./validations/auth.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";

import { UserController, PostController } from './controllers/index.js';
import { postCreateValidation } from "./validations/post.js";

mongoose
  .connect('mongodb+srv://admin:wwwwww@cluster0.jcgeheq.mongodb.net/todo?retryWrites=true&w=majority')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err))

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello asd!');
});

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/getAll', UserController.getAll);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts/:id', PostController.getAll);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);

app.put('/posts/:id', PostController.handlePostUpdate);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('Server OK');
});