import React, {useEffect, useRef, useState} from 'react'
import {Button, Input, message, Select} from "antd";
import axios from "axios";
import {API_URL} from "../data/variables";
import {UserItem} from "../data/interfaces";
import {Link, useNavigate} from "react-router-dom";
import {isValidEmail} from "../utils/data";

interface RegisterProps {
    changeUser: (user: UserItem) => void
}

interface SelectDistrictInterface {
    value: number,
    label: string
}

function Register(props: RegisterProps) {

    const navigate = useNavigate()
    const [name, setName] = useState<string>('')
    const [district, setDistrict] = useState<number>(-1)
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('')

    const [districts, setDistricts] = useState<SelectDistrictInterface[]>([])

    const districtsRef = useRef(0)

    useEffect(() => {
        if (districtsRef.current) return
        districtsRef.current++
        console.log(API_URL + 'districts')
        axios.get(API_URL + 'districts')
            .then((response) => {
                console.log(response)
                if (response.status === 200 && response.data?.districts) {
                    if (Array.isArray(response.data.districts)) {
                        setDistricts(response.data.districts.map((district: any) => {
                            return {
                                label: district.title,
                                value: district.id
                            }
                        }))
                    }
                }
            }).catch(() => {
        })
    }, []);

    const handleRegister = () => {
        if (!isValidEmail(email)) {
            message.error('Введен некорректный e-mail.')
            return
        }
        if (password.length < 8) {
            message.error('Слишком слабый пароль.')
            return
        }
        if (password !== passwordConfirmation) {
            message.error('Пароли не совпадают')
            return
        }
        axios.post(API_URL + 'register', {
            'name': name,
            'email': email,
            'password': password,
            'district_id': district
        }, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => {
            if (response.status === 200 && response.data) {
                props.changeUser(response.data.user as UserItem)
                message.success('Регистрация прошла успешно', 1)
                navigate('/')
            }
        }).catch(error => {
            message.error(error.response.data.error)
        })
    }

    return (
        <div className="Login">
            <div className="Login__Wrapper">
                <h1>Регистрация</h1>
                <div className="Login__Input">
                    <label htmlFor="name">Введите ваше имя</label>
                    <Input value={name} onChange={(event) => setName(event.target.value)} size="large" type="text"
                           id="name" placeholder="Введите ваше имя..."/>
                </div>
                <div className="Login__Input">
                    <label htmlFor="email">Введите ваш e-mail</label>
                    <Input value={email} onChange={(event) => setEmail(event.target.value)} size="large" type="email"
                           id="email" placeholder="Введите email..."/>
                </div>
                <div className="Login__Input">
                    <label htmlFor="email">Выберите ваш район</label>
                    <Select options={districts} onChange={(district) => setDistrict(district)}></Select>
                </div>
                <div className="Login__Input">
                    <label htmlFor="password">Введите ваш пароль</label>
                    <Input value={password} onChange={(event) => setPassword(event.target.value)} size="large"
                           type="password" id="password" placeholder="Введите пароль..."/>
                </div>
                <div className="Login__Input">
                    <label htmlFor="password">Повторите ваш пароль</label>
                    <Input value={passwordConfirmation}
                           onChange={(event) => setPasswordConfirmation(event.target.value)} size="large"
                           type="password" id="password_confirmation" placeholder="Введите пароль..."/>
                </div>
                <p>
                    Уже есть аккаунт? <Link to="/login">Авторизоваться</Link>
                </p>
                <div className="Login__Button">
                    <Button size="middle" type="primary" onClick={handleRegister}>Зарегистрироваться</Button>
                </div>
            </div>
        </div>
    )

}

export default Register