import { Router } from 'express';
import basicAuth from 'express-basic-auth';
import agendash from 'agendash2';
import { Container } from 'typedi';
import config from '../../config';

export default (app: Router) => {
  const agendaInstance = Container.get('agendaInstance');

  app.use(
    '/jobs-dash',
    basicAuth({
      users: {
        [config.agendash.user]: config.agendash.password,
      },
      challenge: true,
    }),
    agendash(agendaInstance),
  );
};
