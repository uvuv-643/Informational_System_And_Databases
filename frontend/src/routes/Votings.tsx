import React, {useEffect, useRef, useState} from 'react'
import {OrderItem, UserItem} from "../data/interfaces";
import VotingListItem from "../components/votings/VotingListItem";
import {message, Spin} from "antd";
import axios from "axios";
import {API_URL} from "../data/variables";
import {handleUnauthorizedError} from "../utils/auth";
import {useNavigate} from "react-router-dom";

interface VotingsProps {
    changeUser: (user: UserItem | null) => void,
    user : UserItem | null
}

function Votings(props: VotingsProps) {

    const votingsRef = useRef(0)
    const votingsMessageRef = useRef(0)

    const navigate = useNavigate()

    const [orders, setOrders] = useState<OrderItem[]>([])
    const [fetched, setFetched] = useState<boolean>(false)

    useEffect(() => {
        if (votingsRef.current) return
        votingsRef.current++
        setTimeout(() => {
            axios.get(API_URL + 'votings', {
                withCredentials: true
            })
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

    if (props.user === null) {
        return <></>
    }
    return (
        <div className="Votings">
            <h1>Проводимые голосования в вашем районе</h1>
            {orders.length ? orders
                .filter(order => order.voting !== null)
                .map((order, index) => {
                    return <VotingListItem order={order} key={index}/>
                }) : (
                <h3 style={{ fontWeight: 400 }}>Сейчас в вашем районе не проводится голосования. Приходите позже!</h3>
            )}
        </div>
    )

}

export default Votings