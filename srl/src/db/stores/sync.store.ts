//CRUD OPE FOR SYNC

import { dbPromise } from "../indexeddb";
import { SyncEvent } from "../types/SyncEvent";

export async function queueSyncEvent(sync :SyncEvent) {
    const db = await dbPromise;
    await db.put("sync_queue", sync);
}

export async function getSyncQueue(): Promise<any> {
    const db = await dbPromise
    await db.getAll("sync_queue");
}

export async function clearSyncEvents(id: string) {
    const db = await dbPromise;
    await db.delete('sync_queue', id);
}

export async function clearAllSyncEvents() {
    const db = await dbPromise;
    const keys = await db.getAllKeys("sync_queue");
    keys.forEach((k) => db.delete("sync_queue", k));
}