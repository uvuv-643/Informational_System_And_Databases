import React from 'react'
import {Button, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {API_URL} from "../../data/variables";
import axios from "axios";

interface FormInputPhotosProps {
    orderId : string
}

function FormInputPhotos(props : FormInputPhotosProps) {

    const handleRemoveFile = async (file: any): Promise<boolean> => {
        const response = await axios.delete(API_URL + 'photo/' + props.orderId + '/' + file.uid);
        return response.status === 200;
    }

    return (
        <div className="Form__Input">
            <label>Добавьте несколько фотографий</label>
            <p>Данные о расположении будут взяты с фотографий, поэтому убедитесь в следующем:</p>
            <ul>
                <li>Все фотографии сделаны на мобильное устройство</li>
                <li>В момент фотографирования на телефоне был включен сбор мета-информации</li>
                <li>Качество фотографии позволяет определить, в чём заключается проблема</li>
            </ul>
            <Upload
                action={(file : any) => {
                    return API_URL + 'photo/' + props.orderId + '/' + file.uid
                }}
                multiple={true}
                withCredentials={true}
                onRemove={handleRemoveFile}
                listType="picture"
                defaultFileList={[]}
            >
                <Button icon={<UploadOutlined/>}>Загрузить фотографии</Button>
            </Upload>
        </div>
    )

}

export default FormInputPhotos