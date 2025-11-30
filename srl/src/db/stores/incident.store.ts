import { Incident } from '../types/Incident'
import { addItem, updateItem, deleteItem, getAllItem} from '../helpers'

const STORE = 'incidents';

function isValidIncident(item: any): item is Incident {
    return (
        item && 
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.description === 'string' &&
        item.entity === 'incident' &&
        item.location &&
        typeof item.location.lat === 'number' &&
        typeof item.location.lng === 'number' &&
        typeof item.createdAt === 'number' &&
        typeof item.updatedAt === 'number' &&
        typeof item.synced === 'boolean' &&
        typeof item.version === 'number' &&
        typeof item.updateAt === 'number'
    )
}

export const IncidentsStore = {
    getAll: async (): Promise<Incident[]> => {
        try {
            const allItems = await getAllItem<any>(STORE);
            console.log('Raw items from IndexedDB:', allItems.length);
            
            // Filter out invalid items and sync_queue entries
            const filtered = allItems.filter(item => {
                // Exclude sync_queue entries (they have 'entity' and 'action' fields)
                if(item.action ) {
                    console.log("Filtered out sync_queue entry:", item.id);
                    return false;
                }
                // Only include valid incidents
                if(!isValidIncident(item)){
                    console.log("Filtered out invalid item:", item.id, item);
                    return false;
                }
                return true;
            });
            
            console.log('Filtered incidents:', filtered.length);
            return filtered;
        } catch (error) {
            console.error('Error getting incidents from IndexedDB:', error);
            return [];
        }
    },

    add: async (incident: Incident): Promise<void> => {
        console.log('Adding incident to store:', incident.id);
        await addItem(STORE, incident);
    },

    update: async (id: string, updates: Partial<Incident>): Promise<void> => {
        console.log('Updating incident:', id, updates);
        await updateItem(STORE, id, updates);
    },
    
      delete: async (id: string): Promise<void> => {
        try {
            console.log('Deleting incident from store:', id);
            await deleteItem(STORE, id);
            console.log('Incident deleted successfully from store:', id);
        } catch (error) {
            console.error('Error deleting incident from store:', error, 'ID:', id);
            throw error;
        }
    },
}