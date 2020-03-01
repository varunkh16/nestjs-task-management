import { Document } from 'mongoose';
import { User } from 'src/auth/user.interface';

export interface Task extends Document {
    id?: string;
    title: string;
    description: string;
    status: string;
    user?: User;
}