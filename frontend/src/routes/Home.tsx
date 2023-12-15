import React, {useEffect, useState} from 'react'
import {Button, Spin} from "antd";
import {Link} from "react-router-dom";
import {UserItem} from "../data/interfaces";

interface HomeProps {
    user : UserItem | null
}

function Home(props : HomeProps) {

    const [fetch, setFetch] = useState<boolean>(true)

    useEffect(() => {
        setTimeout(() => setFetch(false), 1000)
    }, []);

    if (fetch) {
        return <Spin fullscreen />
    }
    return (
        <div>
            <div className="Home__Header">
                <div className="Home__Header__Text">
                    <h1>Умный помощник ЖКХ</h1>
                    <p>
                        Привет! Это умный помощник, и я помогу сделать жизнь в городе комфортнее.
                        Для начала выберите необходимое действие
                    </p>
                    {
                        props.user === null ? (
                            <div className="Home__Header__Buttons">
                                <Link to={"/login"}><Button type="primary">Авторизоваться</Button></Link>
                                <Link to={"/register"}><Button type="primary">Зарегистрироваться</Button></Link>
                            </div>
                        ) : (
                            <div className="Home__Header__Buttons">
                                <Link to={"/orders/create"}><Button type="primary">Подать заявление</Button></Link>
                                <Link to={"/votings"}><Button type="primary">Проголосовать</Button></Link>
                                <Link to={"/orders"}><Button type="primary">Просмотреть все заявки</Button></Link>
                            </div>
                        )
                    }
                </div>
                <div className="Home__Header__Image">
                    <img src="images/header.jpg" alt="#"/>
                </div>
            </div>
        </div>
    )

}

export default Home