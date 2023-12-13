import React from 'react'
import {JobItem} from "../../../data/interfaces";

interface JobProps {
    jobs: JobItem[]
}

function JobColumn(props: JobProps) {
    if (props.jobs.length) {
        return (
            <>
                {props.jobs.map((job, index) => {
                    return (
                        <div key={index}><a rel="noreferrer" target="_blank" href={'/jobs/' + job.id}>Работа
                            #{job.id}, {job.status}</a></div>
                    )
                })}
            </>
        )
    }
    return (
        <>Нет работ</>
    )

}

export default JobColumn