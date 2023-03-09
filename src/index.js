import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Link, NavLink, Navigate, useRoutes } from 'react-router-dom';

import Home from './components/Home';
import User from './components/User';
import Profile from './components/Profile';
import Login from './components/Login';
import Info from './components/Info';

const activeStyle = { backgroundColor: "red" };
const activeClassName = 'active';
const Pages = () => {
  return useRoutes([
    {
      path: '/',
      element: <Home title="首页" />,
    },
    {
      path: '/user',
      element: <User />,
    },
    {
      path: '/profile/:id/:name',
      element: <Profile />,
      children: [
        {
          path: '/profile/:id/:name/info',
          element: <Info />,
        },
      ]
    },
    {
      path: '/user/login',
      element: <Login />,
    },
    {
      path: '*',
      element: <Navigate to="/" />
    }
  ]);
};



ReactDOM.render(
  <div>
    <BrowserRouter>
      <ul>
        <li>
          <NavLink to="/"
            style={({ isActive }) => isActive ? activeStyle : {}}
            className={({ isActive }) => isActive ? activeClassName : ''}
          >
          首页
          </NavLink>
        </li>
        <li><Link to="/user" >用户管理</Link></li>
        <li><Link to="/profile/1111/3333" >个人中心</Link></li>
      </ul>
      <Pages />
    </BrowserRouter>
  </div>
  
  ,
  document.getElementById('app')
);

// 写个