//CRUD OPE FOR SYNC

import { SyncEvent } from "../types/SyncEvent";
import { addItem, deleteItem, getAllItem} from '../helpers'

const STORE = 'sync_queue';

export const SyncStore = {
    add: (event: SyncEvent) => addItem<SyncEvent>(STORE, event),
    getAll: (): Promise<SyncEvent[]> => getAllItem<SyncEvent>(STORE),    
    delete: (id: string) => deleteItem(STORE, id) 
}
