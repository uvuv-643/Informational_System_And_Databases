import React, {useEffect, useRef, useState} from 'react'
import {OrderItem, UserItem} from "../data/interfaces";
import VotingListItem from "../components/votings/VotingListItem";
import {message, Spin} from "antd";
import axios from "axios";
import {API_URL} from "../data/variables";
import {data} from "../components/tables/OwnOrdersTable";
import {handleUnauthorizedError} from "../utils/auth";

interface VotingsProps {
    changeUser: (user: UserItem | null) => void,
    user : UserItem | null
}

function Votings(props: VotingsProps) {

    const votingsRef = useRef(0)

    const [orders, setOrders] = useState<OrderItem[]>(data)
    const [fetched, setFetched] = useState<boolean>(true)
    useEffect(() => {
        if (votingsRef.current) return
        votingsRef.current++
        setTimeout(() => {
            axios.get(API_URL + 'votings')
                .then(response => {
                    if (response.status === 200 && response.data) {
                        setOrders(response.data.orders)
                        setFetched(true)
                    }
                })
                .catch((error) => {
                    handleUnauthorizedError(error, props.changeUser)
                })
        }, 1000)
    }, []);

    if (!fetched) {
        return <Spin fullscreen/>
    }
    return (
        <div className="Votings">
            <h1>Проводимые голосования в вашем районе "{props.user?.district}"</h1>
            {orders.length ? orders
                .filter(order => order.voting !== null)
                .map((order, index) => {
                    return <VotingListItem order={order} key={index}/>
                }) : (
                <h1>Сейчас в вашем районе не проводится голосования. Приходите позже!</h1>
            )}
        </div>
    )

}

export default Votings