import React, {useEffect, useRef} from 'react'
import {UserItem} from "../data/interfaces";
import OwnOrdersTable from "../components/tables/OwnOrdersTable";
import {useNavigate} from "react-router-dom";
import {message} from "antd";

interface OrdersProps {
    user : UserItem | null
}

function Orders(props : OrdersProps) {

    const navigate = useNavigate()
    const messageRef = useRef(0)

    useEffect(() => {
        if (props.user !== null && messageRef.current === 0) {
            messageRef.current++
            message.error('Для просмотра заявлений необходимо сначала авторизоваться')
            navigate('/login')
        }
    }, [props.user]);

    if (props.user === null) {
        return (
            <div className="Orders">
                <OwnOrdersTable user={props.user} />
            </div>
        )
    }
    return <></>

}

export default Orders