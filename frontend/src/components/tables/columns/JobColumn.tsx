import React from 'react'
import {JobItem, UserItem} from "../../../data/interfaces";
import {ROLE} from "../../../data/enums";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";

interface JobProps {
    jobs: JobItem[],
    user : UserItem | null
}

function JobColumn(props: JobProps) {
    if (props.jobs.length) {
        return (
            <div>
                {props.jobs.map((job, index) => {
                    return (
                        <div key={index}><a rel="noreferrer" target="_blank" href={'/jobs/' + job.id}>Работа
                            #{job.id}, {job.status}</a></div>
                    )
                })}
                <div>
                    {
                        props.user?.roles?.includes(ROLE.ADMIN) && (
                            <Button size="small" type="primary">Добавить</Button>
                        )
                    }
                </div>
            </div>
        )
    }
    return (
        <div>
            <div>
                Нет работ
            </div>
            <div>
                {
                    props.user?.roles?.includes(ROLE.ADMIN) && (
                        <Button size="small" type="primary">Добавить</Button>
                    )
                }
            </div>
        </div>
    )

}

export default JobColumn