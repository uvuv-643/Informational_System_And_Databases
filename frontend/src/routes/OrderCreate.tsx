import React, {useEffect, useState} from 'react'
import {Button, message} from "antd";
import {FormDataType, UserItem} from "../data/interfaces";
import {useNavigate} from "react-router-dom";
import FormInputText from "../components/form/FormInputText";
import FormInputPhotos from "../components/form/FormInputPhotos";
import axios from "axios";
import {API_URL} from "../data/variables";
import {handleUnauthorizedError} from "../utils/auth";

const uuid = require('uuid')

interface FormDataOrder {
    description: FormDataType,
    photos: FormDataType,
}

interface OrderCreateProps {
    changeUser: (user: UserItem | null) => void
}

function OrderCreate(props: OrderCreateProps) {

    const [orderId, setOrderId] = useState<string>('')
    useEffect(() => {
        setOrderId(uuid.v4())
    }, []);

    const navigate = useNavigate()
    const [formData, setFormData] = useState<FormDataOrder>({
        description: {
            type: "string",
            value: "",
            label: "Описание"
        },
        photos: {
            type: "photos",
            value: "",
            label: "Фото"
        }
    })

    const updateFormData = (key: string, value: any) => {
        const copyFormData = JSON.parse(JSON.stringify(formData))
        copyFormData[key].value = value
        setFormData(copyFormData)
    }

    const handleSubmitOrder = () => {
        axios.post(API_URL + 'order', {
            orderId: orderId,
            description: formData['description'].value
        }, {
            withCredentials: true
        }).then(response => {
            if (response.status === 200 && response.data) {
                if (response.data.success) {
                    message.success('Заявка успешно создана. Ожидайте рассмотрения.')
                    navigate('/')
                } else {
                    message.error(response.data.message)
                }
            }
        }).catch((error) => {
            message.error(error.response.data.message)
        })
    }

    return (
        <div className="Form">
            <div className="Form__Wrapper">
                <h1>Составить заявление</h1>
                {
                    Object.keys(formData).map((key) => {
                        let type = formData[key as keyof FormDataOrder].type
                        if (type === 'string') {
                            return <FormInputText id={key} data={formData[key as keyof FormDataOrder]}
                                                  updateFormData={updateFormData}/>
                        } else if (type === 'photos') {
                            return <FormInputPhotos orderId={orderId}/>
                        }
                    })
                }
                <div className="Login__Button">
                    <Button size="middle" type="primary" onClick={handleSubmitOrder}>Отправить заявление</Button>
                </div>

            </div>
        </div>
    )

}

export default OrderCreate