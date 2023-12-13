import React, {useState} from 'react'
import {Button} from "antd";
import {FormDataType} from "../data/interfaces";
import {useNavigate} from "react-router-dom";
import FormInputText from "../components/form/FormInputText";
import FormInputPhotos from "../components/form/FormInputPhotos";

interface FormDataOrder {
    description: FormDataType,
    photos: FormDataType,
}

function OrderCreate() {

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

    return (
        <div className="Form">
            <div className="Form__Wrapper">
                <h1>Составить заявление</h1>
                {
                    Object.keys(formData).map((key) => {
                        let type = formData[key as keyof FormDataOrder].type
                        if (type === 'string') {
                            return <FormInputText id={key} data={formData[key as keyof FormDataOrder]} updateFormData={updateFormData}/>
                        } else if (type === 'photos') {
                            return <FormInputPhotos id={key} data={formData[key as keyof FormDataOrder]} updateFormData={updateFormData}/>
                        }
                    })
                }
                <div className="Login__Button">
                    <Button size="middle" type="primary" onClick={() => {
                    }}>Отправить заявление</Button>
                </div>

            </div>
        </div>
    )

}

export default OrderCreate