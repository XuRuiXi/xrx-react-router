import React from 'react';
import { useNavigate } from 'react-router-dom';

const User = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    // na(-2);
    navigate('/profile/1111/3333/info', { replace: false, state: { name: 'zhangsan' } });
  };

  return (
    <div>
      <button onClick={handleClick}>点我</button>
      User
    </div>
  );
};

export default User;