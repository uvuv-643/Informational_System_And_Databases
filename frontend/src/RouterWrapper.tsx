import React, {ReactNode} from 'react'
import Header from "./components/Header";
import {ItemType} from "antd/es/menu/hooks/useItems";

interface RouterWrapperProps {
    currentMenu : string,
    items : ItemType[] | undefined,
    setCurrentMenu : (v : string) => void,
    children : ReactNode
}

function RouterWrapper(props : RouterWrapperProps) {

    return (
        <div className="container">
            <Header setCurrentMenu={props.setCurrentMenu} currentMenu={props.currentMenu} items={props.items} />
            { props.children }
        </div>

    )

}

export default RouterWrapper