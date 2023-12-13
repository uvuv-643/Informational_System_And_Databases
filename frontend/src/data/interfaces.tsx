import {ROLE} from "./enums";

export interface LocationItem {
    street: string,
    house: string,
    district: string
}

export interface VotingItem {
    id: number,
    status: string,
    startedAt: Date,
    finishedAt: Date,
    for: number,
    against: number
}

export interface JobItem {
    id: number,
    status: string,
    startedAt: Date,
    finishedAt: Date,
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
