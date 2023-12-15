import React from 'react'
import {Button, message, Popconfirm} from "antd";
import {DeleteFilled} from "@ant-design/icons";
import {UserItem} from "../../../data/interfaces";
import {ROLE} from "../../../data/enums";
import axios from "axios";
import {API_URL} from "../../../data/variables";
import {handleUnauthorizedError} from "../../../utils/auth";

interface ActionsProps {
    user : UserItem | null,
    orderId ?: number
}

function ActionsColumn(props : ActionsProps) {
    return (
        <div className="table-actions">
            <Popconfirm
                placement="left"
                title={"Удалить заявление"}
                description={"Вы действительно хотите удалить заявление?"}
                okText="Да"
                cancelText="Нет"
                onConfirm={() => {
                    axios.delete(API_URL + 'order/' + props.orderId, {
                        withCredentials: true
                    }).then((response) => {
                        window.location.replace('/orders')
                    }).catch((error) => {
                        message.error("Вы не можете удалить это заявление")
                    })
                }}
            >
                <Button type="link" danger><DeleteFilled /></Button>
            </Popconfirm>
        </div>
    )
}

export default ActionsColumn