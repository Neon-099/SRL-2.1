export interface BaseModel {
    id: string
    createdAt: number
    updateAt: number
    version: number //INCREMENTED EACH CHANGES
}