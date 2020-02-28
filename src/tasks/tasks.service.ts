import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'; 

@Injectable()
export class TasksService {

    constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {}

    getAllTasks(): Promise<Task[]> {
        return this.taskModel.find().exec();
    }

    async getTasksWithFilter(filterDTO: GetTasksFilterDTO): Promise<Task[]> {
        const {status, search} = filterDTO;

        let tasks = await this.getAllTasks();

        if (status) {
            tasks = tasks.filter( task => task.status === status);
        }

        if (search) {
            tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search));
        }

        return tasks;
    }

    async getTaskById(id: string): Promise<Task> {
        const found = await this.taskModel.findById(id).exec();

        if (!found) {
            throw new NotFoundException(`Task with id "${id}" not found`);
        }

        return found;
    }

    createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
        const {title, description, status} = createTaskDTO;

        const task = new this.taskModel();
        task.title = title;
        task.description = description;
        task.status = status;

        return task.save();
    }

    deleteTaskById(id: string): Promise<any> {
        return this.taskModel.findByIdAndRemove(id).exec();
    }

    updateTaskById(id: string, status: TaskStatus): Promise<Task> {
        return this.taskModel.findByIdAndUpdate(id, {$set: {status}}, {new: true}).exec();
    }
}
