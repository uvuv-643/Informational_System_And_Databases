import React, {useEffect, useState} from 'react'
import {createBrowserRouter, RouterProvider, useLocation} from "react-router-dom";
import Home from "./routes/Home";
import {MenuProps} from "antd";
import {BarsOutlined, LogoutOutlined, MailOutlined, ThunderboltOutlined, UserOutlined} from "@ant-design/icons";
import RouterWrapper from "./RouterWrapper";
import Login from "./routes/Login";

const items: MenuProps['items'] = [
    {
        label: 'Мои заявления',
        key: '/my-orders',
        icon: <UserOutlined/>,
    },
    {
        label: 'Все заявления',
        key: '/orders',
        icon: <BarsOutlined/>,
    },
    {
        label: 'Голосования',
        key: '/votings',
        icon: <ThunderboltOutlined/>,
    },
    {
        label: 'Чат',
        key: '/chat',
        icon: <MailOutlined/>,
    },
    {
        label: 'Выйти из аккаунта',
        key: '/logout',
        icon: <LogoutOutlined/>,
    },
];


function App() {

    const [currentMenu, setCurrentMenu] = useState<string>('')

    const router = createBrowserRouter([
        {
            path: "/",
            element: <RouterWrapper setCurrentMenu={setCurrentMenu} currentMenu={currentMenu} items={items}><Home /></RouterWrapper>,
        },
        {
            path: "/login",
            element: <RouterWrapper setCurrentMenu={setCurrentMenu} currentMenu={currentMenu} items={items}><Login /></RouterWrapper>,
        },
        {
            path: "/sign-up",
            element: <RouterWrapper setCurrentMenu={setCurrentMenu} currentMenu={currentMenu} items={items}><Login /></RouterWrapper>,
        },
        {
            path: "/orders",
            element: <RouterWrapper setCurrentMenu={setCurrentMenu} currentMenu={currentMenu} items={items}><Home /></RouterWrapper>,
        },
    ]);

    return (
        <>
            <React.StrictMode>
                <RouterProvider router={router} />
            </React.StrictMode>
        </>

    )
}

export default App
