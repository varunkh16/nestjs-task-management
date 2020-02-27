import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v1';
import { CreateTaskDTO } from './dto/create-task.dto';

@Injectable()
export class TasksService {

    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id === id);
    }

    createTask(createTaskDTO: CreateTaskDTO): Task {
        const {title, description} = createTaskDTO;

        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };
        this.tasks.push(task);
        return task;
    }

    deleteTaskById(id: string): Task[] {
        this.tasks = this.tasks.filter(task => task.id !== id);
        return this.tasks;
    }

    updateTaskById(id: string, status: TaskStatus): Task {
        let task: Task = this.tasks.find(task => task.id === id);
        task.status = status;
        return task;
    }
}
