import React from 'react'
import {UserItem, VotingItem} from "../../../data/interfaces";
import {Button, message, Popconfirm} from "antd";
import {ROLE} from "../../../data/enums";
import {PlusCircleFilled, PlusOutlined} from "@ant-design/icons";

interface VotingProps {
    voting: VotingItem | null,
    user : UserItem | null,
}

function VotingColumn(props: VotingProps) {
    if (props.voting) {
        return (
            <>
                <a rel="noreferrer" target="_blank" href={'/votings/' + props.voting.id}>Голосование
                    #{props.voting.id}, {props.voting.status} ({props.voting.for} | {props.voting.against})</a>
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
                            <Button type="primary" size="small" danger>Завершить</Button>
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
                    <Button type="primary" size="small">Добавить</Button>
                )
            }
        </div>
    )

}

export default VotingColumn