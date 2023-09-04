import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

function controllerRouting(app){
  const router = express.Router();
  app.use('/', router);

  router.get('/status', (req, res) => {
    AppController.getStastus(req, res);
  });

  router.get('/stats', (req, res) => {
    AppController.getStastus(req, res);
  });

  router.post('/users', (req, res) => {
    UsersController.postNew(req, res);
  });

  router.get('/connect', (req, res) => {
    AuthController.getConnect(req, res)
  });

  router.get('/disconnect', (req, res) => {
    AuthController.getDisconnect(req, res)
  });

  router.get('/users/me', (req, res) => {
    UserController.getMe(req, res)
  });
}
export default controllerRouting;