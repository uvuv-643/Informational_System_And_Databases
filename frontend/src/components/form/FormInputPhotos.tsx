import React from 'react'
import {Button, message, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {API_URL} from "../../data/variables";
import axios from "axios";

interface FormInputPhotosProps {
    orderId : string
}

function FormInputPhotos(props : FormInputPhotosProps) {

    const handleRemoveFile = async (file: any): Promise<boolean> => {
        const response = await axios.delete(API_URL + 'photo/' + props.orderId + '/' + file.uid, {withCredentials: true});
        return response.status === 200;
    }

    const uploadImage = async (options : any) => {
        const { onSuccess, onError, file, onProgress } = options;
        const fmData = new FormData();
        const config = {
            headers: { "content-type": "multipart/form-data" },
            withCredentials: true,
        };
        fmData.append("file", file);
        try {
            const res = await axios.post(
                API_URL + 'photo/' + props.orderId + '/' + file.uid,
                fmData,
                config
            );
            onSuccess("Ok");
            console.log("server res: ", res);
        } catch (err : any) {
            const error = new Error(err.response.data.error);
            message.error(err.response.data.error)
            onError({ error });
        }
    };

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
                customRequest={uploadImage}
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