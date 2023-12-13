import React from 'react'
import {Input} from "antd";
import {FormDataType} from "../../data/interfaces";
import TextArea from "antd/es/input/TextArea";

interface FormInputTextProps {
    data : FormDataType,
    id : string,
    updateFormData : (k: string, v: any) => void
}

function FormInputText(props : FormInputTextProps) {

    return (
        <div className="Form__Input" key={props.id}>
            <label htmlFor={props.id}>Введите {props.data.label.toLowerCase()}</label>
            <TextArea value={props.data.value}
                   onChange={(event) => props.updateFormData(props.id, event.target.value)}
                   size="large" id={props.id} placeholder={"Введите " + props.data.label.toLowerCase() + "..."}/>
        </div>
    )

}

export default FormInputText