import React, {useEffect, useRef} from 'react'
import axios from "axios";
import {API_URL} from "../data/variables";
import {useNavigate} from "react-router-dom";
import {UserItem} from "../data/interfaces";
import {message} from "antd";

interface LogoutProps {
    user : UserItem | null,
    changeUser : (user : UserItem | null) => void
}

function Logout(props : LogoutProps) {

    const navigate = useNavigate()
    const logoutRef = useRef(0)

    useEffect(() => {
        if (logoutRef.current) return
        logoutRef.current++;
        axios.post(API_URL + 'logout', {}, {
            withCredentials: true
        }).then(response => {
            props.changeUser(null)
            message.success('Вы успешно вышли из аккаунта')
            navigate('/')
        })
    }, []);

    return <></>

}

export default Logout