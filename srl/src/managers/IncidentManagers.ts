
import { IncidentsStore } from "../db/stores/incident.store";
import { Incident } from "../db/types/Incident";
import { SyncQueue } from './SyncQueueManager';
import { uuid } from '../utils/uuid'
export class IncidentManager {
    static async getAll(): Promise<Incident[]> {
        return await IncidentsStore.getAll()
    }

    static async add(data: Omit<Incident, "id" | 'createdAt' | 'updatedAt' | 'synced'>) {
        const incident: Incident = {
            id: uuid(), //TO PREVENTS DUPLICATED CODE TO UI 
            createdAt: Date.now(),
            updatedAt: Date.now(),
            synced: false,  //SYNC FLAGGED
            ...data
        };

        await IncidentsStore.add(incident);

        //ADD TO SYNC QUEUE FOR BACKEND
        await SyncQueue.queueCreate('incident', incident.id, incident);  //PUSHES TO SYNCED QUEUE

        return incident;
    }

    static async update(id: string , updates: Partial<Incident>) {
        const updated = {
            ...updates,
            updatedAt: Date.now(),
            synced: false
        };

        await IncidentsStore.update(id, updated);

        //ADD TO SYNC QUEUE FOR BACKEND
        await SyncQueue.queueCreate('incident', updated.id, updated);
    }

    static async delete(id: string){
        await IncidentsStore.delete(id);
        
        await SyncQueue().queueDelete('incident', id);
    }   
}