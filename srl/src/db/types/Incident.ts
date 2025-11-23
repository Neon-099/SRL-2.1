import { BaseModel } from "./BaseModel"

export interface Incident extends BaseModel {
    id: string
    type: 'incident' | 'report'
    title: string
    description: string
    photos?: string[]
    location: {lat: number, lng: number}
    createdAt: number
    updatedAt: number
    synced: boolean
}