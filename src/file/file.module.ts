import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { File, TodoSchema as FileSchema } from './entities/file.entity';
import { UserModule } from 'src/user/user.module';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { UploadController } from './upload.controller';
import { HttpModule } from "@nestjs/axios";


@Module({
  imports: [
    HttpModule,
    UserModule,NotificationModule,
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [FileController,UploadController],
  exports:[FileService],
  providers: [FileService],
})
export class Todo1Module {}
