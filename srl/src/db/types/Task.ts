import { BaseModel } from './BaseModel.ts';

export interface Task extends BaseModel {
    id: string
    title: string
    description: string
    entity: 'task'
    status: 'Pending' | 'In Progress' | 'Completed'
    assignedTo: string 
    location: {lat: number, lng: number}
    attachments?: string[]
    createdAt: number
    updatedAt: number
    synced: boolean
}
