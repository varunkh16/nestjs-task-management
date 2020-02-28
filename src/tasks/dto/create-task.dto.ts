import { IsNotEmpty, IsIn } from 'class-validator';
import { TaskStatus } from '../task-status.enum';
export class CreateTaskDTO {
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    status: string;
}