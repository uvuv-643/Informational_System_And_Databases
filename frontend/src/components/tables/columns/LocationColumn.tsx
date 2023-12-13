import React from 'react'
import {LocationItem} from "../../../data/interfaces";

interface LocationProps {
    location : LocationItem
}

function LocationColumn(props : LocationProps) {
    return props.location && (
        <>
            {props.location.district}, {props.location.street}, {props.location.house}
        </>
    )
}

export default LocationColumn