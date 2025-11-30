import { BaseModel } from "./BaseModel"

export interface Incident extends BaseModel {
    id: string
    entity: 'incident' | null
    title: string
    description: string
    photos?: string[]
    location: {lat: number, lng: number}
    createdAt: number
    updatedAt: number
    version: number
    synced: boolean
}