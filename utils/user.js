import RedisClient from "./redis";
import dbClient from "./db";

/**
 * 
 * 
 */
const userUtils = {
    /**
     * 
     * @param {*} request 
     */
  async getUserIdAndKey(request) {
    const object = { useID: null, key: null };

    const XToken = request.header('X-Token');

    if (!XToken) {
      return object;
    }

    object.key = `auth_${XToken}`;

    object.useID = await RedisClient.get(object.key);

    return object;
  },


  async getUser(query) {
    const user = await dbClient.users.findOne(query);
    return user;
  }
}


export default userUtils;