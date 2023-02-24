
import React from 'react';
import { useNavigate, useLocation } from '../react-router-dom';
function Login() {
  let navigate = useNavigate();
  let location = useLocation();
  function handler() {
    localStorage.setItem('user', true);
    let to = '/';
    if (location.state) {
      to = location.state.from || '/';
    }
    navigate(to);
  }
  return (
    <div>
      <button onClick={handler}>登录</button>
    </div>
  );

}


export default Login;