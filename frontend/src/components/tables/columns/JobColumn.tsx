import React from 'react'
import {JobItem, UserItem} from "../../../data/interfaces";
import {ROLE} from "../../../data/enums";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

interface JobProps {
    jobs: JobItem[],
    user : UserItem | null,
    orderId ?: number
}

function JobColumn(props: JobProps) {

    console.log(props.user)


    if (props.jobs.length) {
        return (
            <div>
                {props.jobs.map((job, index) => {
                    return (
                        <div key={index} className="JobItem">
                            <div key={index}>Работа #{job.id}</div>
                            {
                                job.users && job.users.length &&
                                (<span>Участники: { job.users?.map((user : string) => {
                                    return <>{user}</>
                                })}</span>)
                            }
                        </div>
                    )
                })}
                <div>
                    {
                        props.user?.roles?.includes(ROLE.ADMIN) && (
                            <Link to={"/jobs/create/" + props.orderId}><Button size="small" type="primary">Добавить</Button></Link>
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
                        <Link to={"/jobs/create/" + props.orderId}><Button size="small" type="primary">Добавить</Button></Link>
                    )
                }
            </div>
        </div>
    )

}

export default JobColumn