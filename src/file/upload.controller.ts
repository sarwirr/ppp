import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('test')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file.buffer);
    console.log(file.mimetype);
    const base64 = file.buffer.toString('base64');
    console.log(base64);
    // test = File(base64: base64,);
    return { message: 'File uploaded successfully' };
  }
}

export default UploadController;
