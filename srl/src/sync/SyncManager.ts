import { getSyncQueue, clearSyncEvents } from "../db/stores/sync.store";
import { applyServerUpdates } from './SyncStrategies.ts';
import { apiSyncQueue } from '../services/api';

export async function runSync() {
    try{
        const queue = await getSyncQueue();
        if(queue.length === 0) return 0;
        
        //SEND EVENTS TO BACKEND
        const response = await apiSyncQueue(queue);

        //APPLY MERGED RECORDS
        await applyServerUpdates(response.MERGED);

        //CLEAR SUCCESSFULLY SYNCED EVENTS
        for(const item of queue){
            await clearSyncEvents(item.id);
        }

        console.log('Sync complete')
    }
    catch (e) {
        console.error("error: ", e);
        
    }
}