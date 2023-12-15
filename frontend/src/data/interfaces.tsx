import {ROLE} from "./enums";

export interface LocationItem {
    full_address: string,
    district: string
}

export interface VotingItem {
    id: number,
    status: string,
    for: number,
    against: number,
    order_description ?: string
}

export interface JobItem {
    id: number,
    status: string,
    users ?: string[]
}

export interface PhotoItem {
    path: string,
}

export interface OrderItem {
    id ?: number,
    description: string,
    location: LocationItem | null,
    voting: VotingItem | null,
    jobs: JobItem[],
    photos: PhotoItem[],
}

export interface UserItem {
    name : string,
    email : string,
    district : string,
    roles : ROLE[],
}


export interface FormDataType {
    type : string,
    value : any,
    label : string
}