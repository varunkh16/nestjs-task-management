import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'; 
import { User } from 'src/auth/user.interface';

@Injectable()
export class TasksService {

    constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {}

    getAllTasks(user: User): Promise<Task[]> {
        const username = user.username;
        return this.taskModel.find({'user.username': username}).exec();
    }

    async getTasksWithFilter(filterDTO: GetTasksFilterDTO, user: User): Promise<Task[]> {
        const {status, search} = filterDTO;

        let tasks = await this.getAllTasks(user);

        if (status) {
            tasks = tasks.filter( task => task.status === status);
        }

        if (search) {
            tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search));
        }

        return tasks;
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const username = user.username;
        const found = await this.taskModel.findOne({'_id': id, 'user.username': username}).exec();

        if (!found) {
            throw new NotFoundException(`Task with id "${id}" not found`);
        }

        return found;
    }

    async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
        const {title, description, status} = createTaskDTO;

        const task = new this.taskModel();
        task.title = title;
        task.description = description;
        task.status = status;
        task.user = user;

        const save = await task.save();

        save.user = undefined;

        return save;
    }

    deleteTaskById(id: string, user: User): Promise<any> {
        const username = user.username;
        return this.taskModel.findOneAndDelete({'_id': id, 'user.username': username}).exec();
    }

    updateTaskById(id: string, status: TaskStatus, user: User): Promise<Task> {
        const username = user.username;
        return this.taskModel.findOneAndUpdate({'_id': id, 'user.username': username}, {$set: {status}}, {new: true}).exec();
    }
}
