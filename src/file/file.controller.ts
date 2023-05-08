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
import { Todo1Service } from './file.service';
import { CreateTodo1Dto } from './dto/create-file.dto';
import { UpdateTodo1Dto } from './dto/update-file.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import uniqueFileName from 'src/utils/uniqueFileName';

@UseGuards(JwtAuthGuard)
@Controller('todo1')
@UseGuards(JwtAuthGuard)
export class Todo1Controller {
  constructor(private readonly todo1Service: Todo1Service) {}

  
  @Post()
  create(@Body() createTodo1Dto: CreateTodo1Dto, @Request() req) {

    return this.todo1Service.create(createTodo1Dto, req.user.userId);
  }

  @Post('createforuser/:id')
  createforuser(@Body() createTodo1Dto: CreateTodo1Dto, @Param('id') id: string) {
    return this.todo1Service.createforuser(createTodo1Dto, id);
  }


  @Get()
  findAll() {
    return this.todo1Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todo1Service.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTodo1Dto: UpdateTodo1Dto) {
  //   return this.todo1Service.update(id, updateTodo1Dto);
  // }

  @Patch('/upload')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
      //  destination: './public/uploads/profiles/avatar',
        filename: uniqueFileName,
      }),
    }),
  )
  async updateProfile(
    @Param('id') id: string,
    @Optional()@UploadedFile() avatar: Express.Multer.File,
    @Optional()@Body() updateProfileDto: UpdateTodo1Dto,
  ) {
    return await this.todo1Service.updatefile(
      id,
      avatar,
      updateProfileDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: any) {
    return this.todo1Service.remove(id);
  }
}
