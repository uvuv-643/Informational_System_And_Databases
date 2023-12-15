import React from 'react'
import {LocationItem} from "../../../data/interfaces";

interface LocationProps {
    location : LocationItem
}

function LocationColumn(props : LocationProps) {
    return props.location && (
        <>
            {props.location.district}, {props.location.full_address}
        </>
    )
}

export default LocationColumn