import React from 'react'
import {PhotoItem} from "../../../data/interfaces";
import {API_URL} from "../../../data/variables";

interface PhotoProps {
    photos: PhotoItem[]
}

function PhotoColumn(props: PhotoProps) {
    if (props.photos.length) {
        return (
            <div className="table-photos">
                {props.photos.map((photo, index) => {
                    return (
                        <div key={index}><a rel="noreferrer" target="_blank" href={'http://127.0.0.1:8080/' + photo.path}>
                            <img src={'http://127.0.0.1:8080/' + photo.path} alt="#"/>
                        </a></div>
                    )
                })}
            </div>
        )
    }
    return (
        <>Нет фото</>
    )

}

export default PhotoColumn