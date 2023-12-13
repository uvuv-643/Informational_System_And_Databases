import React, {useEffect, useRef, useState} from 'react'
import {OrderItem, UserItem} from "../data/interfaces";
import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";
import {API_URL} from "../data/variables";
import {Button, message, Select, Spin} from "antd";
import {handleUnauthorizedError} from "../utils/auth";

interface JobCreateProps {
    user : UserItem | null,
    changeUser : (user : UserItem | null) => void
}

interface SelectInterface {
    value : number,
    label : string
}


function JobCreate(props: JobCreateProps) {

    const [searchParams, setSearchParams] = useSearchParams()

    const orderId = searchParams.get('id')
    const [admins, setAdmins] = useState<SelectInterface[]>([
        {
            value: 1,
            label: 'admin'
        },
        {
            value: 5,
            label: 'admin1'
        },
        {
            value: 7,
            label: 'admin5'
        },
    ])
    const [order, setOrder] = useState<OrderItem | null>(null)

    const jobCreateRef = useRef(0)

    // useEffect(() => {
    //     if (jobCreateRef.current) return
    //     jobCreateRef.current++
    //     axios.all([
    //         axios.get(API_URL + 'admins'),
    //         axios.get(API_URL + 'order/' + orderId)
    //     ])
    //         .then(axios.spread((responseAdmins, responseOrder) => {
    //             if (responseAdmins.status === 200 && responseOrder.status === 200) {
    //                 if (responseAdmins.data && responseOrder.data) {
    //                     setAdmins(responseAdmins.data.admins.map((admin : any) => {
    //                         return {
    //                             value: admin.id,
    //                             label: admin.name
    //                         }
    //                     }))
    //                     setOrder(responseOrder.data.order)
    //                 }
    //             }
    //         }))
    //         .catch((error) => {
    //             handleUnauthorizedError(error, props.changeUser)
    //         })
    // }, []);

    const navigate = useNavigate()

    const [selectedAdmins, setSelectedAdmins] = useState<number[]>([])
    const filteredAdmins = admins.filter((o) => !selectedAdmins.includes(o.value));

    const handleCreateJob = () => {
        axios.post(API_URL + 'jobs/' + orderId, {
            users: selectedAdmins
        })
        .then(response => {
            if (response.status === 200 && response.data.success) {
                message.success('Работа по заявке успешно создана', 2).then(() => {
                    navigate('/orders')
                })
            } else {
                message.error(response.data.message)
            }
        }).catch((error) => {
            handleUnauthorizedError(error, props.changeUser)
        })
    }

    // if (order === null) {
    //     return <Spin fullscreen />
    // }

    return (
        <div className="JobCreate">
            <h1>Начать работу по заявке</h1>
            <p>Текст заявки: { order?.description?.substring(0, 100) }.</p>

            <label htmlFor="admins">Выберите ответственных администраторов</label>
            <Select
                id="admins"
                mode="multiple"
                placeholder="Выберите ответственных администраторов"
                onChange={setSelectedAdmins}
                style={{
                    width: '100%',
                }}
                options={filteredAdmins}
                />

            <Button type="primary" onClick={handleCreateJob}>Добавить работу</Button>

        </div>
    )

}

export default JobCreate