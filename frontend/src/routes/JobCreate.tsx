import React, {useEffect, useRef, useState} from 'react'
import {OrderItem, UserItem} from "../data/interfaces";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
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

    const searchParams = useParams()

    const orderId = searchParams['id']
    const [admins, setAdmins] = useState<SelectInterface[]>([])
    const [order, setOrder] = useState<OrderItem | null>(null)

    const [fetch, setFetch] = useState<boolean>(true)
    const jobCreateRef = useRef(0)

    useEffect(() => {
        if (jobCreateRef.current) return
        jobCreateRef.current++
        axios.all([
            axios.get(API_URL + 'admins', { withCredentials: true }),
            axios.get(API_URL + 'order/' + orderId, { withCredentials: true })
        ])
            .then(axios.spread((responseAdmins, responseOrder) => {
                if (responseAdmins.status === 200 && responseOrder.status === 200) {
                    if (responseAdmins.data && responseOrder.data) {
                        setAdmins(responseAdmins.data.users.map((admin : any) => {
                            return {
                                value: admin.id,
                                label: admin.name
                            }
                        }))
                        setOrder(responseOrder.data.order)
                    }
                }
            }))
            .catch((error) => {

            }).finally(() => {
                setFetch(false)
        })
    }, []);

    const navigate = useNavigate()

    const [selectedAdmins, setSelectedAdmins] = useState<number[]>([])
    const filteredAdmins = admins.filter((o) => !selectedAdmins.includes(o.value));

    const handleCreateJob = () => {
        axios.post(API_URL + 'job/' + orderId, {
            users: selectedAdmins
        }, {withCredentials: true})
        .then(response => {
            if (response.status === 200 && response.data.success) {
                message.success('Работа по заявке успешно создана')
                navigate('/orders')
            } else {
                message.error(response.data.message)
            }
        }).catch((error) => {
            message.error(error.response.data.message)
        })
    }

    if (fetch) {
        return <Spin fullscreen />
    }

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