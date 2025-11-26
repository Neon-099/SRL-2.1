import { Task } from '../types/Task';
import { addItem, updateItem, deleteItem, getAllItem } from '../helpers';

const STORE = 'tasks';


function isValidTask(item: any): item is Task {
    return (
        item && 
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.description === 'string' &&
        typeof item.type === 'string' &&
        (item.status === 'Pending' || item.status === 'In Progress' || item.status === 'Completed') &&
        item.location &&
        typeof item.assignedTo === 'string' &&
        typeof item.location.lat === 'number' &&
        typeof item.location.lng === 'number' &&
        typeof item.createdAt === 'number' &&
        typeof item.updatedAt === 'number' &&
        typeof item.synced === 'boolean' &&
        typeof item.version === 'number' &&
        typeof item.updateAt === 'number'
    )
}

export const TaskStore = {
    getAll: async (): Promise<Task[]> => {
        try {
            const AllItems = await getAllItem<any>(STORE);

            //FILTER OUT INVALID ITEMS AND SYNC_QUEUE ENTRIES
            const filtered = AllItems.filter(item => {
                //EXCLUDE SYNC_QUEUE ITEMS AND SYNC_QUEUE ENTRIES
                if(item.entity || item.action || item.timestamp){
                    console.log("Filtered out sync_queue entry: ", item.id);
                    return false
                }
                //ONLY INCLUDE VALID INCIDENTS
                if(isValidTask(item)){
                    console.log('Filtered out invalid items: ', item.id, item)
                    return false;
                }
                return true;
            });

            console.log('Filtered Incidents: ', filtered.length);
            return filtered;
        }
        catch (err){
            console.error('Error getting task from indexxeddb', err);
            return[];
        }
    },

    add: async (task: Task): Promise<void> => {
        console.log('Adding task: ', task);
        await addItem('task', task);
    },
    update: async (id: string, updates: Partial<Task>): Promise<void> => {
        console.log("Updating task: ")
        await updateItem('task', id, updates);
    },
    delete: async (id: string): Promise<void> => {
        console.log("Deleting Items: ");
        await deleteItem('task', id);
    }
}