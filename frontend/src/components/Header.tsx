import React, {useEffect} from 'react'
import {Menu, MenuProps} from "antd";
import '../styles/main.scss'
import {useLocation, useNavigate} from "react-router-dom";
import {ItemType} from "antd/es/menu/hooks/useItems";

interface HeaderPropsInterface {
    currentMenu : string,
    items : ItemType[] | undefined,
    setCurrentMenu : (v : string) => void
}

function Header(props : HeaderPropsInterface) {


    let navigate = useNavigate();
    let location = useLocation();

    const onClick: MenuProps['onClick'] = (e) => {
        props.setCurrentMenu(e.key)
        navigate(e.key)
    };


    useEffect(() => {
        let pathName = location.pathname
        props.items?.forEach((item) => {
            if (typeof item?.key === 'string' && pathName.includes(item?.key)) {
                props.setCurrentMenu(item?.key)
                pathName = item?.key
            }
        })
        props.setCurrentMenu(pathName)
    }, [location.pathname, props])

    return (
        <div className="Header">
            <Menu style={{justifyContent: 'flex-end'}} onClick={onClick} selectedKeys={[props.currentMenu]}
                  mode="horizontal"
                  items={props.items}/>
        </div>
    )
}

export default Header
