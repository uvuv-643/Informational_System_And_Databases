import React, {useEffect, useRef, useState} from 'react'
import {OrderItem, UserItem} from "../data/interfaces";
import OwnOrdersTable from "../components/tables/OwnOrdersTable";
import {Link} from "react-router-dom";
import {Button, Spin} from "antd";
import axios from "axios";
import {API_URL} from "../data/variables";
import {handleUnauthorizedError} from "../utils/auth";
import {ROLE} from "../data/enums";

interface OrdersProps {
    user : UserItem | null,
    changeUser : (user : UserItem | null) => void
}

function Orders(props : OrdersProps) {

    const orderRef = useRef(0)
    const [orders, setOrders] = useState<OrderItem[]>([])
    const [fetching, setFetching] = useState<boolean>(true)

    useEffect(() => {
        if (orderRef.current > 0) return;
        orderRef.current++
        axios.get(API_URL + 'orders', {
            withCredentials: true
        }).then(response => {
            if (response.status === 200) {
                setOrders(response.data.orders)
                setFetching(false)
            }
        }).catch(error => {
            handleUnauthorizedError(error, props.changeUser)
        })
    }, []);

    if (fetching) {
        return <Spin fullscreen/>
    }
    if (props.user !== null) {
        return (
            <div className="Orders">
                {
                    props.user.roles.includes(ROLE.ADMIN) ? <h1>Все заявления</h1> : <h1>Ваши заявления</h1>
                }
                <Link to="/orders/create"><Button type="primary">Подать новое заявление</Button></Link>
                <br/><br/>
                <OwnOrdersTable user={props.user} data={orders} />
            </div>
        )
    }
    return <></>

}

export default Orders