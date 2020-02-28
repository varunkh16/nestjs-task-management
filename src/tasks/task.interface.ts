import { Document } from 'mongoose';

export interface Task extends Document {
    id?: string;
    title: string;
    description: string;
    status: string;
}