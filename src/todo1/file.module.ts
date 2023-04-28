import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo1Service } from './file.service';
import { Todo1Controller } from './file.controller';
import { File, TodoSchema as FileSchema } from './entities/file.entity';
import { UserModule } from 'src/user/user.module';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { UploadController } from './upload.controller';

@Module({
  imports: [UserModule,NotificationModule,
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [Todo1Controller,UploadController],
  exports:[Todo1Service],
  providers: [Todo1Service],
})
export class Todo1Module {}
