import { useEffect, useState } from "react";
import { Task } from '../db/types/Task'
import { TaskManager } from "../managers/TaskManagers";

export function useTasks() {
    const [tasks, setTasks ] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);

    console.log('useTasks called', tasks)
    async function load() {
        setLoading(true);
        try {
            console.log('Loading incidents...');
            const data = await TaskManager.getAll();
            console.log('Loaded incidents:', data.length);
            setTasks(data);
        } catch (error) {
            console.error('Error loading incidents:', error);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load()
    }, []);

    async function add(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'synced'>) {
        try {
            console.log('Adding incident:', data);
            await TaskManager.add(data);
            console.log('Incident added, reloading...');
            await load();
        } catch (error) {
            console.error('Error adding incident:', error);
            throw error;
        }
    }

    async function update(id: string, payload: Partial<Task>) {
        try {
            console.log('Updating incident:', id, payload);
            await TaskManager.update(id, payload);
            console.log('Incident updated, reloading...');
            await load();
        } catch (error) {
            console.error('Error updating incident:', error);
            throw error;
        }
    }

    async function remove(id: string) {
        try {
            console.log('Deleting incident:', id);
            await TaskManager.delete(id);
            console.log('Incident deleted, reloading...');
            await load();
        } catch (error) {
            console.error('Error deleting incident:', error);
            throw error;
        }
    }
    
    return { tasks, loading, add, update, deleted: remove }
}