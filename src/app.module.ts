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

@Module({
  imports: [
    MulterModule.register({
    dest: './uploads',
  }),
    Todo1Module,
    MongooseModule.forRoot(
      'mongodb+srv://sarwir:UwOupSTJqhj6MUNe@cluster0.36mf4ku.mongodb.net/pppp?retryWrites=true&w=majority',
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
    consumer.apply(todo1Middleware).forRoutes('todo1');
  }
}
