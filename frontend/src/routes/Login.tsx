import React, {useState} from 'react'
import {Button, Input, message} from "antd";
import axios from "axios";
import {API_URL} from "../data/variables";
import {UserItem} from "../data/interfaces";
import {Link, useNavigate} from "react-router-dom";
import {isValidEmail} from "../utils/data";

interface LoginProps {
    changeUser: (user : UserItem) => void
}

function Login(props : LoginProps) {

    const navigate = useNavigate()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleLogin = () => {
        if (!isValidEmail(email)) {
            message.error('Введен некорректный e-mail.')
            return
        }
        if (password.length < 8) {
            message.error('Слишком слабый пароль.')
            return
        }
        axios.post(API_URL + 'login', {
            'email': email,
            'password': password,
        }, {
            withCredentials: true,
        }).then(response => {
            if (response.status === 200 && response.data) {
                props.changeUser(response.data.user as UserItem)
                message.success('Авторизация прошла успешно', 1)
                navigate('/')
            }
        }).catch(error => {
            message.error(error.response.data.error)
        })
    }

    return (
        <div className="Login">
            <div className="Login__Wrapper">
                <h1>Войти в аккаунт</h1>
                <div className="Login__Input">
                    <label htmlFor="email">Введите ваш e-mail</label>
                    <Input value={email} onChange={(event) => setEmail(event.target.value)} size="large" type="email" id="email" placeholder="Введите email..."/>
                </div>
                <div className="Login__Input">
                    <label htmlFor="password">Введите ваш пароль</label>
                    <Input value={password} onChange={(event) => setPassword(event.target.value)}  size="large" type="password" id="password" placeholder="Введите пароль..."/>
                </div>
                <p>
                    Ещё нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </p>
                <div className="Login__Button">
                    <Button size="middle" type="primary" onClick={handleLogin}>Войти</Button>
                </div>

            </div>
        </div>
    )

}

export default Login