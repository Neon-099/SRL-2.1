

export interface SyncEvent  {
    id: string
    entity: 'task' | 'incident'
    action: 'CREATE' | 'UPDATE' | 'DELETE'
    payload: any 
    timestamp: number
    version: number
}