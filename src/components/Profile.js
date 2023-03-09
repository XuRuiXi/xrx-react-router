import React, { useEffect } from 'react';
import { useParams, useMatch, useLocation, Outlet, useNavigate, useSearchParams } from 'react-router-dom';

function Profile(){
  const [getParams, setParams] = useSearchParams();
  console.log(getParams.get('a'));
  const a = useParams();
  const info = useMatch('Profile/:id/:a');
  // console.log(a);
  // console.log(info);
  // console.log(useLocation());
  const navigate = useNavigate();

  useEffect(() => {
    // navigate('/profile/1111/3333/info', { replace: true });
    // setParams(res => {
    //   console.log(res.entries());
    // });
  }, []);
  return(
    <h1>
      Profile
      <Outlet />
    </h1>
  );
}


export default Profile;