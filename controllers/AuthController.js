const { v4: uuidv4 } = require('uuid');
const sha1 = require('sha1');
const rediclint = require('../utils/redis')
const userUtils = require('../utils/user')

class AuthController{
    static async getConnect(request, response) {
      const Authorization = request.header('Authorization') || '';

      const credentials = Authorization.split(' ')[1];

      if (!credentials) {
        return response.status(401).send({error: 'Unauthorized'});
      }

      const decodecredentials = Buffer.from(credentials, 'base64').toString(
        'utf-8'
      );

      const [email, password] = decodecredentials.split(':');

      if (!email || !password){
        return response.status(401).send({error: 'Unauthorized'})
      };

      const hashedpswd = sha1(password);

      const user = await userUtils.getUser({
        email,
        password: hashedpswd
      });

      if (!user) {
        return response.status(401).send({error: 'Unauthorized'});
      }

      const token = uuidv4();
      const key = `auth_${token}`
      const ExpirationHours = 24;

      await rediclint.set(key, user._id.toString(), ExpirationHours * 3600)

      return response.status(200).send({token })
    }

    static async getDisconnect(request, response) {
      const { userId, key } = await userUtils.getUserIdAndKey(request)
      
      if (!userId){
        return response.status(401).send({error: 'Unauthorized'});
      };
      await rediclint.del(key);
      return response.status(200).send()
    }
  }
  export default AuthController;