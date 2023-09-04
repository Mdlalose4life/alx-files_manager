import express from 'express';
import AppController from '../controllers/AppController';

function controllerRouting(app){
  const router = express.Router();
  app.use('/', router);

  router.get('/status', (req, res) => {
    AppController.getStastus(req, res);
  });

  router.get('/stats', (req, res) => {
    AppController.getStastus(req, res);
  });
}
export default controllerRouting;