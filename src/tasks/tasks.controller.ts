import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipe/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.interface';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.interface';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterDTO: GetTasksFilterDTO, @GetUser() user: User): Promise<Task[]> {
        this.logger.verbose(`User ${user.username} getting all tasks. Filters ${JSON.stringify(filterDTO)}`);
        if (Object.keys(filterDTO).length) {
            return this.tasksService.getTasksWithFilter(filterDTO, user);
        } else {
            return this.tasksService.getAllTasks(user);
        }
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDTO: CreateTaskDTO, @GetUser() user: User): Promise<Task> {
        return this.tasksService.createTask(createTaskDTO, user);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string, @GetUser() user: User): Promise<any> {
        return this.tasksService.deleteTaskById(id, user);
    }

    @Patch('/:id/status')
    updateTaskById(@Param('id') id: string, @Body('status', TaskStatusValidationPipe) status: TaskStatus, @GetUser() user: User): Promise<Task> {
        return this.tasksService.updateTaskById(id, status, user);
    }
}
