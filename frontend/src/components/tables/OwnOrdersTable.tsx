import React from 'react'
import {Table} from "antd";
import {JobItem, LocationItem, OrderItem, PhotoItem, UserItem, VotingItem} from "../../data/interfaces";
import LocationColumn from "./columns/LocationColumn";
import VotingColumn from "./columns/VotingColumn";
import JobColumn from "./columns/JobColumn";
import PhotoColumn from "./columns/PhotoColumn";
import ActionsColumn from "./columns/ActionsColumn";

export const data: OrderItem[] = [
    {
        description: 'haha',
        location: null,
        voting: null,
        jobs: [],
        photos: [],
    },
    {
        description: 'lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum hahalorem ipsum hahalorem ipsum hahalorem ipsum hahalorem ipsum haha lorem ipsum hahalorem ipsum hahalorem ipsum hahalorem ipsum hahalorem ipsum hahalorem ipsum hahalorem ipsum haha',
        location: {
            street: 'пркт. Гагарина',
            house: 'д. 139',
            district: 'г. Торез'
        },
        voting: null,
        jobs: [],
        photos: [],
    },
    {
        description: 'lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum hahalorem ipsum hahalorem ipsum hahalorem ipsum hahalorem ipsum haha lorem ipsum hahalorem ipsum hahalorem ipsum hahalorem ipsum hahalorem ipsum hahalorem ipsum hahalorem ipsum haha',
        location: {
            street: 'пркт. Гагарина',
            house: 'д. 139',
            district: 'г. Торез'
        },
        voting: {
            id: 151,
            status: 'закончено',
            for: 167,
            against: 7
        },
        jobs: [],
        photos: [],
    },
    {
        description: 'lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum haha lorem ipsum hahalorem ipsum hahalorem ipsum hahalorem ipsum hahalorem ipsum haha lorem ipsum hahalorem ipsum hahalorem ipsum hahalorem ipsum hahalorem ipsum hahalorem ipsum hahalorem ipsum haha',
        location: {
            street: 'пркт. Гагарина',
            house: 'д. 139',
            district: 'г. Торез'
        },
        voting: {
            id: 157,
            status: 'закончено',
            for: 167,
            against: 7
        },
        jobs: [
            {
                id: 15,
                status: 'закончено',
            },
            {
                id: 18,
                status: 'в процессе',
            },
        ],
        photos: [
            {
                path: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
            },
            {
                path: 'https://media.macphun.com/img/uploads/customer/how-to/608/15542038745ca344e267fb80.28757312.jpg?q=85&w=1340'
            }
        ],
    },
];

interface OwnOrdersTableProps {
    user : UserItem | null
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
            render: (voting: VotingItem | null) => {
                return <VotingColumn voting={voting} user={props.user} />
            }
        },
        {
            title: 'Работы по заявке',
            dataIndex: 'jobs',
            key: 'jobs',
            render: (jobs: JobItem[]) => {
                return <JobColumn jobs={jobs} user={props.user} />
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
            render: () => {
                return <ActionsColumn user={props.user} />
            }
        },
    ];

    return (
        <>
            <Table columns={columns} dataSource={data} pagination={{
                position: ['none', 'none'],
            }}/>
        </>
    );


}

export default OwnOrdersTable