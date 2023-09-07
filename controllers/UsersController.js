import dbClient from '../utils/db';
import Queue from 'bull';
import sha1 from 'sha1';
import userUtils from '../utils/user';

const userQueue = new Queue('userQueue');

class UsersController{
  static async postNew(request, response){
    const { email, password } = request.body;

    if (!email){
      return response.status(400).send({ error: 'Missing email' });
    }

    if(!password){
      return response.status(400).send({ error:'Missing password' });
    }

    const emailExist = await dbClient.users.findOne({ email });

    if (emailExist){
      return response.status(400).send({ error: 'Already exist' });
    }

    const sha1password = sha1(password);

    let save;
    try {
      save = await dbClient.users.insertOne({
        email,
        password: sha1password,
      });
    } catch (err){
      await userQueue.add({});
      return response.status(500).send({error: 'Error creating user.'})
    }
    
    const user = {
      id: save.insertId,
      email,
    };

    await userQueue.add({
      userId: save.insertId.toString(),
    });

    return response.status(201).send(user)
  }

  static async getMe(request, response) {
    const { userId } = await userUtils.getUserIdAndKey(request);

    const user = await userUtils.getUser({
      _id: Object(userId),
    });

    if (!user) {
      return response.status(401).send({error: 'Unauthorized'});
    }

    const processedUSer = {id: user._id, ...user};
    delete processedUSer._id;
    delete processedUSer.password;

    return response.status(200).send(processedUSer);
  }
}

export default UsersController;