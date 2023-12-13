import {message} from "antd";
import {UserItem} from "../data/interfaces";

export function handleUnauthorizedError(error : any, changeUser : (user : UserItem | null) => void) {
    if (error.status === 401 || error.status === 403) {
        changeUser(null)
        message.error('Произошла ошибка при получении данных. Авторизуйтесь повторно в системе', 2)
            .then(() => {
                setTimeout(() => {
                    window.location.replace('/')
                }, 2)
            })
    } else {
        message.error('Сервер временно не может обработать ваш запрос. Попробуйте позже', 2).then(() => {
            setTimeout(() => {
                window.location.replace('/')
            }, 2)
        })
    }
}