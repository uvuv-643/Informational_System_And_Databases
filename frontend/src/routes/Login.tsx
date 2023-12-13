import React from 'react'
import {Button, Input} from "antd";

interface LoginProps {

}

function Login(props : LoginProps) {

    return (
        <div className="Login">
            <div className="Login__Wrapper">
                <h1>Войти в аккаунт</h1>
                <div className="Login__Input">
                    <label htmlFor="email">Введите ваш e-mail</label>
                    <Input size="large" type="email" id="email" placeholder="Введите email..."/>
                </div>
                <div className="Login__Input">
                    <label htmlFor="password">Введите ваш пароль</label>
                    <Input size="large" type="password" id="password" placeholder="Введите пароль..."/>
                </div>
                <div className="Login__Button">
                    <Button size="middle" type="primary" >Войти</Button>
                </div>
            </div>
        </div>
    )

}

export default Login