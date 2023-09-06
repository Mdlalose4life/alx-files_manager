import { ObjectId } from 'mongodb';
import userUtils from '../utils/user';
import fileUtils from '../utils/file';
import basicUtils from '../utils/basic';
import Queue from 'bull';

const FOLDER_PATH = process.env.FOLDER_PATHT || '/tmp/files_manager'

const fileQueue = new Queue('fileQueue');

class FilesController{
  /**
   * 
   *
   * 
   * 
   * 
   */
  static async postUpload(request, response){
    const { userId } = await userUtils.getUserIdAndKey(request)

    if (basicUtils.isIdValid(userId) == false){
        return response.status(401).send({error: 'Unauthorized'});
    }
    if (!userId && request.body.type == 'image'){
        await fileQueue.add({});
    }

    const user = await userUtils.getUser({
      _id: ObjectId(userId)
    });

    if (!user) {
      return response.status(401).send({error: 'Unauthorized'});
    }

    const { error: ValidationError, fileParam } = await fileUtils.BodyValidate(
      request
    );

    if (BodyValidate){
      return response.status(400).send({error: ValidationError});
    }

    if (fileParam.parentId !== 0 && !basicUtils.isIdValid(fileParam.parentId)){
        return response.status(400).send({error: 'Parent not found'});
    }

    const {error, code, newFile} = await fileUtils.saveFile(
      userId,
      fileParam,
      FOLDER_PATH,
    );
  }
}


export default FilesController;