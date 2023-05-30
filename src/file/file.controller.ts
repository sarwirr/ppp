import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  Optional,
  UploadedFile,
} from '@nestjs/common';
import { FileService as FileService } from './file.service';
import { UpdateTodo1Dto } from './dto/update-file.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import uniqueFileName from 'src/utils/uniqueFileName';

@UseGuards(JwtAuthGuard)
@Controller('file')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly FileService: FileService) {}

  
  @Post()
  @UseInterceptors(FileInterceptor('file', {storage: diskStorage({destination :'/home/sarwir/files',filename:(req,file,cb)=>{
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  cb(null, file.filename + '-' + uniqueSuffix); },}

    )}))
  create(@Request() req, @UploadedFile() file: Express.Multer.File) {
  return this.FileService.create(req.user.userId,file);
  }

@Get('testtest/:id')
  testtest(@Param('id') id: any) {
    return this.FileService.result(id);
  }

  @Get('findall')
  findAll() {
    return this.FileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.FileService.findOne(id);
  }

  


  @Patch('/upload')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
      
        filename: uniqueFileName,
      }),
    }),
  )
  async updateProfile(
    @Param('id') id: string,
    @Optional()@UploadedFile() avatar: Express.Multer.File,
    @Optional()@Body() updateProfileDto: UpdateTodo1Dto,
  ) {
    return await this.FileService.updatefile(
      id,
      avatar,
      updateProfileDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: any) {
    return this.FileService.remove(id)
    ;
  }
}
