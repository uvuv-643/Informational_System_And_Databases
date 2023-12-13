import React from 'react'
import {Button, message, Popconfirm} from "antd";
import {DeleteFilled} from "@ant-design/icons";

interface ActionsProps {

}

function ActionsColumn(props : ActionsProps) {
    return (
        <div className="table-actions">
            <Button type="primary" onClick={() => {}} >Редактировать</Button>
            <Popconfirm
                placement="left"
                title={"Удалить заявление"}
                description={"Вы действительно хотите удалить заявление?"}
                okText="Да"
                cancelText="Нет"
                onConfirm={() => {
                    message.success('Заявление было успешно удалено')
                }}
            >
                <Button type="link" danger><DeleteFilled /></Button>
            </Popconfirm>
        </div>
    )
}

export default ActionsColumn