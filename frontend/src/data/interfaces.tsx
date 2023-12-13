import {ROLE} from "./enums";

export interface LocationItem {
    street: string,
    house: string,
    district: string
}

export interface VotingItem {
    id: number,
    status: string,
    for: number,
    against: number,
    order ?: {
        description : string
    }
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