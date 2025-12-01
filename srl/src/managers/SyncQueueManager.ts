

import { SyncStore } from '../db/stores/sync.store';
import { SyncEvent } from '../db/types/SyncEvent';

export class SyncQueue {
    static async queueCreate(entity: 'task' | 'incident', ids: string, payload: any){
        await SyncStore.add({
            id: crypto.randomUUID(),
            entity,
            action: 'CREATE',
            payload: {ids, ...payload},
            timestamp: Date.now(),
            version: 1
        });
    }

    static async queueUpdate(entity: 'task' | 'incident', ids: string, payload: any){
        await SyncStore.add({
            id: crypto.randomUUID(),
            entity,
            action: 'UPDATE',
            payload: {ids, ...payload},
            timestamp: Date.now(),
            version: 1
        });
    }

    static async queueDelete (entity: 'task' | 'incident', ids: string){
        await SyncStore.add({
            id: crypto.randomUUID(),
            entity,
            action: 'DELETE',
            payload: {ids},
            timestamp: Date.now(),
            version: 1
        });
    }

    static async syncWithServer(api: string){
        const items = await SyncStore.getAll();

        for(const event of items){
            try{
                await fetch(`${api}/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(event)
                });

                await SyncStore.delete(event.id);
            }
            catch (err) {
                console.error("Sync Failed due to low connection", err);
            }
        }
       
    }
}