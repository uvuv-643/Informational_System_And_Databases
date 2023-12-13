import React from 'react'
import {UserItem} from "../data/interfaces";
import OwnOrdersTable from "../components/tables/OwnOrdersTable";

interface OrdersProps {
    user : UserItem | null
}

function Orders(props : OrdersProps) {

    return (
        <div className="Orders">
            <OwnOrdersTable />
        </div>
    )

}

export default Orders