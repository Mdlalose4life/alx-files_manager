import dbClient from '../utils/db';
import Queue from 'bull';
import sha1 from 'sha1';

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
      id: save.insetId,
      email,
    };

    await userQueue.add({
      userId: save.insertId.toString(),
    });

    return response.status(201).send(user)
  } 
}
export default UsersController;