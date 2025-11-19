//CRUD OPE FOR TASKS

import { dbPromise } from "../indexeddb";
import { Task } from "../types/Task";

export async function addTask(task :Task) {
    const db = await dbPromise;
    await db.put("tasks", task);
}

export async function getTask(id: string) {
    const db = await dbPromise
    await db.get("tasks", id);
}

export async function getAllTask() {
    const db = await dbPromise;
    await db.getAll("tasks");
}

export async function updateTask(task: Task) {
    const db = await dbPromise;
    task.updateAt = Date.now();
    task.version++;
    await db.put('tasks', task);
}

export async function deleteTask(id: string) {
    const db = await dbPromise;
    await db.delete('tasks' ,id);
}