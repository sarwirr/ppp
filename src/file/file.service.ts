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
import axios from 'axios';
import { HttpService } from "@nestjs/axios";
import { ChildProcess, exec, spawn } from 'child_process';



@Injectable()
export class FileService {

  private flaskProcess: ChildProcess;
  todoRepository: any;
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>,
  @InjectModel(User.name) private userRepository: Model<UserDocument>,
  private readonly us : UserService,
  private readonly ns: NotificationService,
  private httpService: HttpService) {}

  // upload file function
  async create(id:any ,@UploadedFile() file: Express.Multer.File) {

    //  console.log(id);
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

    // console.log(createdFile.path);
    // console.log(createdFile);
    user.fileList.push(createdFile);
    // console.log(user.fileList);
    await this.us.update(user.email, { fileList: user.fileList } as UpdateUserDto);
    return { message: 'File uploaded successfully'};
      
  }


// show result via flask api
  async showresult(id:any){
    try {
      console.log(id);
      const user = await this.us.findUserbyId(id);
      console.log(user);
      const fileToTreat = await this.fileModel.findOne({ owner: user._id });
      console.log(fileToTreat);

      const imagePath = fileToTreat.path;
      console.log(imagePath);

      //run flask
      const venvPath = '/home/sarwir/python-environments/env'; // Update with the path to your virtual environment
      const flaskScriptPath = '/home/sarwir/ppp/flask.py'; // Update with the correct path to your run_flask.py file
  
      this.flaskProcess = exec(`source ${venvPath}/bin/activate && python ${flaskScriptPath}`);
  
      this.flaskProcess.stdout.on('data', (data) => {
        console.log(`Flask output: ${data}`);
      });
  
      this.flaskProcess.stderr.on('data', (data) => {
        console.error(`Flask error: ${data}`);
      });
      // Wait for the Flask application to start (optional, if required)
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Make the HTTP request to the Flask application
      const url = `http://127.0.0.1:5000/predict/${encodeURIComponent(imagePath)}`;
      const response = await this.httpService.get(url).toPromise();

      // Process the response as needed
      const predictions = response.data.predictions;

      // Handle the predictions or return them as the response
      return predictions;
    } catch (error) {
      // Handle any errors
      console.error(error);
      throw new Error('An error occurred while making the request.');
    }
  }
  


  runFlaskApp() {
    const venvPath = '/home/sarwir/python-environments/env'; // Update with the path to your virtual environment
    const flaskScriptPath = '/home/sarwir/ppp/flask.py'; // Update with the correct path to your run_flask.py file

    this.flaskProcess = exec(`source ${venvPath}/bin/activate && python ${flaskScriptPath}`);

    this.flaskProcess.stdout.on('data', (data) => {
      console.log(`Flask output: ${data}`);
    });

    this.flaskProcess.stderr.on('data', (data) => {
      console.error(`Flask error: ${data}`);
    });
  }

  stopFlaskApp() {
    // Terminate the Flask process if needed
    if (this.flaskProcess) {
      this.flaskProcess.kill();
    }
  }


  async runFlaskScript(): Promise<ChildProcess> {
    const scriptPath = '/home/sarwir/ppp/flask.py'; // Path to your Flask.py file
    const process = spawn('python', [scriptPath]);
  
    process.stdout.on('data', (data) => {
      console.log(`Flask script output: ${data}`);
    });
  
    process.stderr.on('data', (data) => {
      console.error(`Flask script error: ${data}`);
    });
  
    return process;
  }
   


    
  async result(id:any){
    console.log(id);
    const user = await this.us.findUserbyId(id);
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
