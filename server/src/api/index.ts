import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import manga from './routes/manga';
import agendash from './routes/agendash';
import random_list from './routes/random-list';
// guaranteed to get dependencies
export default () => {
  const app = Router();
  auth(app);
  user(app);
  manga(app);
  agendash(app);
  random_list(app);
  return app;
};
