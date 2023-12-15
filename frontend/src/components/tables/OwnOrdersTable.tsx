import React from 'react'
import {Table} from "antd";
import {JobItem, LocationItem, OrderItem, PhotoItem, UserItem, VotingItem} from "../../data/interfaces";
import LocationColumn from "./columns/LocationColumn";
import VotingColumn from "./columns/VotingColumn";
import JobColumn from "./columns/JobColumn";
import PhotoColumn from "./columns/PhotoColumn";
import ActionsColumn from "./columns/ActionsColumn";


interface OwnOrdersTableProps {
    user : UserItem | null,
    data : OrderItem[]
}

function OwnOrdersTable(props : OwnOrdersTableProps) {

    const columns = [
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Расположение',
            dataIndex: 'location',
            key: 'location',
            render: (location: LocationItem | null) => {
                return location && <LocationColumn location={location}/>
            },
        },
        {
            title: 'Голосование',
            dataIndex: 'voting',
            key: 'voting',
            render: (voting: VotingItem | null, record : OrderItem) => {
                return <VotingColumn orderId={record.id} voting={voting} user={props.user} />
            }
        },
        {
            title: 'Работы по заявке',
            dataIndex: 'jobs',
            key: 'jobs',
            render: (jobs: JobItem[], record : OrderItem) => {
                return <JobColumn orderId={record.id} jobs={jobs} user={props.user} />
            }
        },
        {
            title: 'Фотографии',
            dataIndex: 'photos',
            key: 'photos',
            render: (photos: PhotoItem[]) => {
                return <PhotoColumn photos={photos} />
            }
        },
        {
            title: 'Действия',
            dataIndex: 'id',
            key: 'id',
            render: (_ : any, record : OrderItem) => {
                return <ActionsColumn orderId={record.id} user={props.user} />
            }
        },
    ];

    return (
        <>
            <Table columns={columns} dataSource={props.data}/>
        </>
    );


}

export default OwnOrdersTable