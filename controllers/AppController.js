import rediclint from '../utils/redis';
import dbClient from '../utils/db';

class AppController{
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
  static getStatus(req, res){
    const status = {
      redis: rediclint.isAlive(),
      db: dbClient.isAlive(),
    }
    res.status(200).send(status);
  }

  static async getStats(req, res){
    const stats = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    }
    res.status(200).send(stats);
  }
}

export default AppController;