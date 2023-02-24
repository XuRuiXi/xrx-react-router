import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Link, NavLink, Navigate } from './react-router-dom';

import Home from './components/Home';
import User from './components/User';
import Profile from './components/Profile';
import Login from './components/Login';
import Protected from './components/Protected';

const activeStyle = { backgroundColor: "red" };
const activeClassName = 'active';

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
        <li><Link to="/profile" >个人中心</Link></li>
      </ul>
      <Routes>
        <Route path='/' element={<Home title="Home"></Home>}></Route>
        <Route path='/user' element={<User></User>}></Route>
        <Route path="/profile" element={<Protected component={Profile} />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </div>
  
  ,
  document.getElementById('app')
);
