import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TasksModule, MongooseModule.forRoot('mongodb://localhost:27017/taskmanagement'), AuthModule],
})
export class AppModule {}
