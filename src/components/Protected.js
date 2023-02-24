import React from 'react';
import { Navigate } from '../react-router-dom';

function Protected(props) {
  let { component: RouteComponent, match } = props;
  return (
    localStorage.getItem('user') ? <RouteComponent></RouteComponent> :
      <Navigate to={{ pathname: '/login', state: { from: match.path } }}></Navigate>
  );
}

export default Protected;