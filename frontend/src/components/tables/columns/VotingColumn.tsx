import React from 'react'
import {UserItem, VotingItem} from "../../../data/interfaces";
import {Button, message, Popconfirm} from "antd";
import {ROLE} from "../../../data/enums";
import {PlusCircleFilled, PlusOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import axios from "axios";
import {API_URL} from "../../../data/variables";

interface VotingProps {
    voting: VotingItem | null,
    user : UserItem | null,
    orderId ?: number
}

function VotingColumn(props: VotingProps) {

    const handleChangeVoting = () => {
        axios.post(API_URL + 'voting/' + props.orderId, {}, {
            withCredentials: true
        }).then(response => {
            window.location.replace('/orders')
        }).catch((error) => {
            message.error("Вы не можете редактировать это голосование")
        })
    }

    if (props.voting) {
        return (
            <>
                <Link to={'/votings/' + props.voting.id}>Голосование
                    #{props.voting.id}, {props.voting.status} ({props.voting.for} | {props.voting.against})</Link>
                {
                    props.voting.status !== 'завершено' && props.user?.roles?.includes(ROLE.ADMIN) && (
                        <Popconfirm
                            placement="left"
                            title={"Завершить голосование"}
                            description={"Вы действительно хотите завершить голосование?"}
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={() => {
                                message.success('Голосование было успешно завершено. Ознакомиться с результатми можно перейдя по ссылке.')
                            }}
                        >
                            <Button type="primary" size="small" onClick={handleChangeVoting} danger>Завершить</Button>
                        </Popconfirm>
                    )
                }
            </>


        )
    }

    return (
        <div>
            <div>Нет голосования</div>
            {
                props.user?.roles?.includes(ROLE.ADMIN) && (
                    <Button type="primary" size="small" onClick={handleChangeVoting}>Добавить</Button>
                )
            }
        </div>
    )

}

export default VotingColumn