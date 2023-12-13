import React from 'react'
import {PhotoItem} from "../../../data/interfaces";

interface PhotoProps {
    photos: PhotoItem[]
}

function PhotoColumn(props: PhotoProps) {
    if (props.photos.length) {
        return (
            <div className="table-photos">
                {props.photos.map((photo, index) => {
                    return (
                        <div key={index}><a rel="noreferrer" target="_blank" href={photo.path}>
                            <img src={photo.path} alt="#"/>
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