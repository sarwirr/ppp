import { Model } from 'mongoose';

import { Injectable, UploadedFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateTodo1Dto } from './dto/update-file.dto';
import { File, FileDocument } from './entities/file.entity';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { NotificationService } from 'src/notification/notification.service';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import * as fs from 'fs';
import { fromByteArray } from 'base64-js';
import { diskStorage } from 'multer';



@Injectable()
export class FileService {
  
  todoRepository: any;
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>,
  @InjectModel(User.name) private userRepository: Model<UserDocument>,
  private readonly us : UserService,
  private readonly ns: NotificationService) {}

  async create(id:any ,@UploadedFile() file: Express.Multer.File) {

     console.log(id);
    const user = await this.us.findUserbyId(id);
     console.log(user);
    const fileContent = fs.readFileSync(file.path);
    const base64Content = fromByteArray(fileContent);
    const createdFile =  await this.fileModel.create({ 
      type: file.mimetype,
      name: file.originalname,
      file: base64Content,
      owner: user._id,
      path: file.path,
    })

    console.log(createdFile.path);
    // console.log(createdFile);
    user.fileList.push(createdFile);
    // console.log(user.fileList);
    await this.us.update(user.email, { fileList: user.fileList } as UpdateUserDto);
    return { message: 'File uploaded successfully'};
      
  }

async result (id:any) {
  
const fileToTreat = await this.fileModel.findOne({ _id: id });
console.log(fileToTreat);
const fileContent = fileToTreat.file;


  // return file;


}
  async findAll(): Promise<File[]> {
    return this.fileModel.find();
  }

  async findOne(id: string): Promise<File> {
    return this.fileModel.findOne({
       _id: id 
    });
  }

  update(id: string, updateTodo1Dto: UpdateTodo1Dto) {
    return this.fileModel.findByIdAndUpdate(id, updateTodo1Dto);
  }

  async remove(id: any) {
    await this.fileModel.findOneAndDelete({ _id: id });
    return { message: 'File deleted successfully'};
 
  }
  async updatefile(id: string, avatar: Express.Multer.File, updateProfileDto: any): Promise<any> {
    let photo = this.profileImage(avatar);
    try {
      return await this.update(
        id,
        { ...updateProfileDto, profileImage: photo },
        // { new: true },
      );
    }
    catch (err) {
      throw new Error(`Error updating ${this.us}: ${err}`);
    }
  }

  profileImage(avatar: Express.Multer.File): string {
    let photo;
    if (avatar) {
      photo = avatar.path.replace('public', '').split('\\').join('/');
    }
    return photo;
  }
}
