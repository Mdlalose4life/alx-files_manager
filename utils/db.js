const { MongoClient } = require('mongodb');

const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_PORT = process.env.DB_PORT || 27017
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager'
const url = `mongodb://${DB_HOST}:${DB_PORT}`

/**
 * 
 */
class DBClient{
  constructor(){
    MongoClient.connect(url, (err, client) =>{
      if(!err){
          this.db = client.db(DB_DATABASE);
          this.users = this.db.collection('users');
          this.files = this.db.collection('files');
        } else {
            console.log(err.message);
            this.db = false;
        }
      });
    }
    /**
     * 
     * @returns 
     */
    isAlive(){
      return Boolean(this.db)
    }

    /**
     * 
     * @returns 
     */
    async nbUsers(){
      const numberOfUsers = this.users.countDocuments();
      return numberOfUsers;
    }

    /**
     * 
     * @returns 
     */
    async nbFiles(){
      const numberOfFiles = this.files.countDocuments();
      return numberOfFiles;
    }
  }
  const dbClient = new DBClient();

  export default dbClient;