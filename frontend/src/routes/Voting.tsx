import React, {useEffect, useRef, useState} from 'react'
import {UserItem, VotingItem} from "../data/interfaces";
import {Button, message, Spin, Tag} from "antd";
import axios from "axios";
import {API_URL} from "../data/variables";
import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {handleUnauthorizedError} from "../utils/auth";

interface VotingProps {
    user: UserItem | null,
    changeUser : (user : UserItem | null) => void
}

function Voting(props: VotingProps) {

    const votingRef = useRef(0)

    const params = useParams();
    const [voting, setVoting] = useState<VotingItem | null>(null)
    useEffect(() => {
        if (votingRef.current) return
        votingRef.current++
        setTimeout(() => {
            axios.get(API_URL + 'votings/' + params['id'], {
                withCredentials: true
            })
            .then(response => {
                if (response.status === 200 && response.data) {
                    setVoting(response.data.voting as VotingItem)
                }
            }).catch((error) => {
                handleUnauthorizedError(error, props.changeUser)
            })
        }, 1000)
    }, []);

    const handleVote = (vote : number) => {
        axios.post(API_URL + 'vote/' + params['id'] + '/' + vote, {}, {
            withCredentials: true
        })
            .then(response => {
                if (response.status === 200 && response.data) {
                    message.success('Вы успешно проголосовали!')
                    setTimeout(() => {
                        window.location.replace('/votings')
                    }, 1000)
                }
            }).catch((error) => {
            message.error(error.response.data.message)
        })
    }

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

                    <h1>{voting?.order_description?.substring(0, 30)} <Tag color={"success"}
                                                                         style={{fontSize: 18}}>{voting?.status}</Tag>
                    </h1>
                    <div className="Voting__Votes">
                        За: {voting?.for}, против: {voting?.against}
                    </div>
                    <h4>Отдайте свой голос!</h4>
                    <div className="Voting__Buttons">
                        <div className="Voting__Button--For">
                            <Button type="primary" onClick={() => {handleVote(1)}} style={{background: '#43bf64'}}>За! Давно пора!!!</Button>
                        </div>
                        <div className="Voting__Button--Against">
                            <Button type="primary" onClick={() => {handleVote(0)}} danger>Против! Отстой!!!</Button>
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