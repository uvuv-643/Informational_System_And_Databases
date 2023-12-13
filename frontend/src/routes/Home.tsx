import React from 'react'
import {Button} from "antd";
import {Link} from "react-router-dom";

function Home() {
    return (
        <div>
            <div className="Home__Header">
                <div className="Home__Header__Text">
                    <h1>Умный помощник ЖКХ</h1>
                    <p>
                        Привет! Это умный помощник, и я помогу сделать жизнь в городе комфортнее.
                        Для начала выберите необходимое действие
                    </p>
                    <div className="Home__Header__Buttons">
                        <Link to={"/orders/create"}><Button type="primary">Подать заявление</Button></Link>
                        <Link to={"/orders"}><Button type="primary">Просмотреть все заявки</Button></Link>
                        <Link to={"/votings"}><Button type="primary">Проголосовать</Button></Link>
                        <Link to={"/chat"}><Button type="primary">Связаться с поддержкой</Button></Link>
                    </div>
                </div>
                <div className="Home__Header__Image">
                    <img src="images/header.jpg" alt="#"/>
                </div>
            </div>
        </div>

    )
}

export default Home