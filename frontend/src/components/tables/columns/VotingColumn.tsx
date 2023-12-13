import React from 'react'
import {VotingItem} from "../../../data/interfaces";

interface VotingProps {
    voting: VotingItem | null
}

function VotingColumn(props: VotingProps) {
    if (props.voting) {
        return (
            <a rel="noreferrer" target="_blank" href={'/votings/' + props.voting.id}>Голосование
                #{props.voting.id}, {props.voting.status} ({props.voting.for} | {props.voting.against})</a>
        )
    }
    return (
        <>Нет голосования</>
    )

}

export default VotingColumn