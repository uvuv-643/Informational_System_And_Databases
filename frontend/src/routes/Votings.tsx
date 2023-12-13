import React, {useEffect, useState} from 'react'
import {OrderItem, UserItem} from "../data/interfaces";
import VotingListItem from "../components/votings/VotingListItem";
import {message, Spin} from "antd";
import axios from "axios";
import {API_URL} from "../data/variables";
import {data} from "../components/tables/OwnOrdersTable";

interface VotingsProps {
    changeUser: (user: UserItem | null) => void,
    user : UserItem | null
}

function Votings(props: VotingsProps) {

    const [orders, setOrders] = useState<OrderItem[]>(data)
    const [fetched, setFetched] = useState<boolean>(true)
    // useEffect(() => {
    //     setTimeout(() => {
    //         axios.get(API_URL + 'votings')
    //             .then(response => {
    //                 if (response.status === 200 && response.data) {
    //                     setOrders(response.data.orders)
    //                     setFetched(true)
    //                 }
    //             })
    //             .catch((error) => {
    //                 if (error.status === 401 || error.status === 403) {
    //                     props.changeUser(null)
    //                     message.error('Произошла ошибка при получении данных. Авторизуйтесь повторно в системе', 2)
    //                         .then(() => {
    //                             window.location.replace('/')
    //                         })
    //                 } else {
    //                     window.location.replace('/')
    //                 }
    //             })
    //     }, 1000)
    // }, []);

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