import { queueSyncEvent } from '../db/stores/sync.store';
import { SyncEvent } from '../db/types/SyncEvent';
import { uuid } from '../utils/uuid';

export async function addToSyncQueue(
    entity: "task" | 'incident',
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    payload: any,
    version: number
    ) {
    const event: SyncEvent = {
        id: uuid(),
        entity,
        action,
        payload,
        version,
        timestamp: Date.now(),
    };

    await queueSyncEvent(event);
}

