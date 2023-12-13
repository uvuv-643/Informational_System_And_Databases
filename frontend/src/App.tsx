import React, {useEffect, useState} from 'react'
import {createBrowserRouter, RouterProvider, useLocation} from "react-router-dom";
import Home from "./routes/Home";
import {MenuProps} from "antd";
import {
    BarsOutlined,
    HomeOutlined, LoginOutlined,
    LogoutOutlined,
    MailOutlined,
    ThunderboltOutlined,
    UserOutlined
} from "@ant-design/icons";
import RouterWrapper from "./RouterWrapper";
import Login from "./routes/Login";
import {UserItem} from "./data/interfaces";
import Register from "./routes/Register";
import Orders from "./routes/Orders";
import OrderCreate from "./routes/OrderCreate";


function App() {

    const [items, setItems] = useState<MenuProps['items'] >([])
    const [user, setUser] = useState<UserItem | null>(null)
    const [currentMenu, setCurrentMenu] = useState<string>('')

    useEffect(() => {
        let currentItems : MenuProps['items'] = []
        currentItems = currentItems.concat([
            {
                label: 'Главная',
                key: '/',
                icon: <HomeOutlined />,
            },
            {
                label: 'Заявления',
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
        ])
        if (user !== null) {
            currentItems = currentItems.concat([
                {
                    label: 'Выйти из аккаунта',
                    key: '/logout',
                    icon: <LogoutOutlined/>,
                },
            ])
        } else {
            currentItems = currentItems.concat([
                {
                    label: 'Авторизоваться',
                    key: '/login',
                    icon: <LoginOutlined/>,
                },
            ])
        }
        setItems(currentItems)
    }, [user]);


    const router = createBrowserRouter([
        {
            path: "/",
            element: <RouterWrapper setCurrentMenu={setCurrentMenu} currentMenu={currentMenu} items={items}><Home /></RouterWrapper>,
        },
        {
            path: "/login",
            element: <RouterWrapper setCurrentMenu={setCurrentMenu} currentMenu={currentMenu} items={items}><Login changeUser={setUser}/></RouterWrapper>,
        },
        {
            path: "/register",
            element: <RouterWrapper setCurrentMenu={setCurrentMenu} currentMenu={currentMenu} items={items}><Register changeUser={setUser} /></RouterWrapper>,
        },
        {
            path: "/orders",
            element: <RouterWrapper setCurrentMenu={setCurrentMenu} currentMenu={currentMenu} items={items}><Orders user={user}/></RouterWrapper>,
        },
        {
            path: "/orders/create",
            element: <RouterWrapper setCurrentMenu={setCurrentMenu} currentMenu={currentMenu} items={items}><OrderCreate /></RouterWrapper>,
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
