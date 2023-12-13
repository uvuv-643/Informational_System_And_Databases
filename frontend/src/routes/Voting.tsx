import React, {useEffect, useRef, useState} from 'react'
import {UserItem, VotingItem} from "../data/interfaces";
import {Button, message, Spin, Tag} from "antd";
import axios from "axios";
import {API_URL} from "../data/variables";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {handleUnauthorizedError} from "../utils/auth";

interface VotingProps {
    user: UserItem | null,
    changeUser : (user : UserItem | null) => void
}

function Voting(props: VotingProps) {

    const navigate = useNavigate()
    const votingRef = useRef(0)

    const [searchParams, setSearchParams] = useSearchParams();
    const [voting, setVoting] = useState<VotingItem | null>({
        id: 15,
        status: 'голос',
        for: 167,
        against: 7,
        order: {
            description: "hahaha)"
        }
    })
    useEffect(() => {
        if (votingRef.current) return
        votingRef.current++
        setTimeout(() => {
            axios.get(API_URL + 'votings/' + searchParams.get('id'))
            .then(response => {
                if (response.status === 200 && response.data) {
                    setVoting(response.data.voting as VotingItem)
                }
            }).catch((error) => {
                handleUnauthorizedError(error, props.changeUser)
            })
        }, 1000)
    }, []);

    if (voting === null) {
        return <Spin fullscreen/>
    }
    if (voting.status === 'завершено') {
        return (
            <>
                <div className="Voting">
                    <div className="Voting__Wrapper">
                        <h1>Голосование уже завершено. <Tag color={"success"}
                                 style={{fontSize: 24, padding: '7px 15px'}}>За: {voting.for}, против: {voting.against}</Tag>
                        </h1>
                    </div>
                    <Link to="/votings"><Button type="primary" size="middle">Вернуться назад</Button></Link>
                </div>
            </>
        )
    }
    if (voting.status === 'голос') {
        return (
            <>
                <div className="Voting">
                    <div className="Voting__Wrapper">
                        <h1>Вы уже отдали свой голос, спасибо! <Tag color={"success"}
                                                            style={{fontSize: 24, padding: '7px 15px'}}>За: {voting.for}, против: {voting.against}</Tag>
                        </h1>
                    </div>
                    <Link to="/votings"><Button type="primary" size="middle">Вернуться назад</Button></Link>
                </div>
            </>
        )
    }
    return (
        <div className="Voting">
            <div className="Voting__Wrapper">
                <div className="Voting__Content">

                    <h1>{voting?.order?.description?.substring(0, 30)} <Tag color={"success"}
                                                                         style={{fontSize: 18}}>{voting?.status}</Tag>
                    </h1>
                    <div className="Voting__Votes">
                        За: {voting?.for}, против: {voting?.against}
                    </div>
                    <h4>Отдайте свой голос!</h4>
                    <div className="Voting__Buttons">
                        <div className="Voting__Button--For">
                            <Button type="primary" style={{background: '#43bf64'}}>За! Давно пора!!!</Button>
                        </div>
                        <div className="Voting__Button--Against">
                            <Button type="primary" danger>Против! Отстой!!!</Button>
                        </div>
                    </div>
                </div>
                <div className="Voting__Image">
                    <img src="/images/vote.png" alt="#"/>
                </div>
            </div>
        </div>
    )

}

export default Voting