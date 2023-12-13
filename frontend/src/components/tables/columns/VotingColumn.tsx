import React from 'react'
import {UserItem, VotingItem} from "../../../data/interfaces";
import {Button} from "antd";
import {ROLE} from "../../../data/enums";
import {PlusCircleFilled, PlusOutlined} from "@ant-design/icons";

interface VotingProps {
    voting: VotingItem | null,
    user : UserItem | null,
}

function VotingColumn(props: VotingProps) {
    if (props.voting) {
        return (
            <a rel="noreferrer" target="_blank" href={'/votings/' + props.voting.id}>Голосование
                #{props.voting.id}, {props.voting.status} ({props.voting.for} | {props.voting.against})</a>
        )
    }
    return (
        <div>
            <div>Нет голосования</div>
            {
                props.user?.roles?.includes(ROLE.ADMIN) && (
                    <Button type="primary">Добавить</Button>
                )
            }
        </div>
    )

}

export default VotingColumn