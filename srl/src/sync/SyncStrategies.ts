import { updateTask } from "../db/stores/tasks.store";
import { updateIncident} from '../db/stores/incident.store';

export async function applyServerUpdates(items: any[]) {
    for(const item of items){
        if(item.entity === "task"){
            await updateTask(item.data);
        }
        if(item.entity === 'incident'){
            await updateIncident(item.data);
        }
    }
}