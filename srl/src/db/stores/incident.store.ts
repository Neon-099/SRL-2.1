//CRUD OPE FOR TASKS

import { dbPromise } from "../indexeddb";
import { Incident } from "../types/Incident";

export async function addIncident(incident :Incident) {
    const db = await dbPromise;
    await db.put("incidents", incident);
}

export async function getIncident(id: string) {
    const db = await dbPromise
    await db.get("incidents", id);
}

export async function getAllIncident() {
    const db = await dbPromise;
    await db.getAll("incidents");
}

export async function updateIncident(data: Incident) {
    const db = await dbPromise;
    data.updateAt = Date.now();
    data.version++;
    await db.put("incidents", data);
}

export async function deleteIncident(id: string) {
    const db = await dbPromise;
    await db.delete('incidents', id);
}