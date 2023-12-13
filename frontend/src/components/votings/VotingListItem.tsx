import React from 'react'
import {OrderItem, VotingItem} from "../../data/interfaces";
import {Link} from "react-router-dom";
import {Button} from "antd";

interface VotingListItemProps {
    order : OrderItem
}

function VotingListItem(props : VotingListItemProps) {

    return (
        <div className="VotingListItem">
            <div className="VotingListItem__Description">
                <h3>{ props.order.description.substr(0, 250) }</h3>
                <h4>{ props.order.location?.district }, { props.order.location?.street }, { props.order.location?.house }</h4>
            </div>
            <div className="VotingListItem__Photos">
                <div className="table-photos">
                    {props.order.photos.map((photo, index) => {
                        return (
                            <div key={index}><a rel="noreferrer" target="_blank" href={photo.path}>
                                <img src={photo.path} alt="#"/>
                            </a></div>
                        )
                    })}
                </div>
            </div>
            <div className="VotingListItem__Link">
                <Link to={'/votings/' + props.order.voting?.id}><Button type="primary">Отдать голос</Button></Link>
            </div>
        </div>
    )

}

export default VotingListItem