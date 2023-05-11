import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Todo1Controller } from './file/file.controller';
import { Todo1Module } from './file/file.module';
import { MongooseModule } from '@nestjs/mongoose';
import { todo1Middleware } from './file/file.middleware';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { MulterModule } from '@nestjs/platform-express';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
require('dotenv').config(); 

@Module({
  imports: [
    MulterModule.register({
    dest: './uploads',
  }),
    Todo1Module,
    MongooseModule.forRoot(
      process.env.MONGODB_KEY,
    ),
    UserModule,
    AuthModule,
    NotificationModule,
  ],
  controllers: [AppController, Todo1Controller,  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // consumer.apply(todo1Middleware).forRoutes('todo1');
  }
}
