import { TaskStore } from '../db/stores/tasks.store';
import { Task } from '../db/types/Task'
import { SyncQueue } from './SyncQueueManager';
import { uuid } from '../utils/uuid';

export class TaskManager {
    static async getAll(): Promise<Task[]> {
        return await TaskStore.getAll();
    }
    static async add(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'synced'>){
        const task : Task = {
            id: uuid(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            synced: false,
            ...data
        };
        await TaskStore.add(task);

        //ADD TO SYNC QUEUE FOR BACKEND
        await SyncQueue.queueCreate('task', task.id, task);

        return task;
    }
    static async update(id: string, updates: Partial<Task>){
        const updated = {
            ...updates,
            updatedAt: Date.now(),
            synced: false,
        };

        await TaskStore.update(id, updated);
    
        //ADD TO SYNC QUEUE TO BACKEND
        await SyncQueue.queueUpdate('task', id, updated);
    }

    static async delete(id: string){
        await TaskStore.delete(id);

        await SyncQueue.queueDelete('task' ,id);
    }
}