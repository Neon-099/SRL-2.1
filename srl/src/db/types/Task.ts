import { BaseModel } from './BaseModel.ts';

export interface Task extends BaseModel {
    title: string
    description: string
    status: 'Pending' | 'In Progress' | 'Completed'
    assignedTo: string 
    location: {lat: number, lng: number}
    attachments?: string[]
}
