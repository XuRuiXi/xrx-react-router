/**
 * A `<Router>` for use in web browsers. Provides the cleanest URLs.
 * 一个Router用浏览器上，提供地址
 */
import React from 'react';
import { Router, useNavigate, useLocation } from '../react-router';
import { createHashHistory, createBrowserHistory } from "../history";
export * from '../react-router';


// 获取路由信息
function BrowserRouter({ children }) {
  let historyRef = React.useRef(); //{}
  //获取到history =>{} =>最新的路由数据
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory();
  }
  let history = historyRef.current;

  //获取到最新的路由地址
  let [state, setState] = React.useState({
    action: history.action, //方法  pop push
    location: history.location //当前路径
  });
  console.log(state);
  //监听
  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      location={state.location}
      navigator={history}
      navigationType={state.action}
    >
      {children}
    </Router>
  );
}


function HashRouter({ children }) {
  let historyRef = React.useRef();
  if (historyRef.current == null) {
    historyRef.current = createHashHistory();
  }
  let history = historyRef.current;
  let [state, setState] = React.useState({
    action: history.action,
    location: history.location
  });
  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      location={state.location}
      navigationType={state.action}
      navigator={history}
    >
      {children}
    </Router>
  );
}


export function Link({ to, ...rest }) {
  let navigate = useNavigate();
  function handleClick(e) {
    e.preventDefault();
    navigate(to);
  }
  return (
    <a
      {...rest}
      href={to}
      onClick={handleClick}
    />
  );
}

export const NavLink = function ({
  className: classNameProp = "",
  end = false,
  style: styleProp = {},
  to,
  children,
  ...rest
}) {
  let location = useLocation();
  let path = { pathname: to };
  let locationPathname = location.pathname;
  let toPathname = path.pathname;
  let isActive = locationPathname === toPathname || (!end && locationPathname.startsWith(toPathname) && locationPathname.charAt(toPathname.length) === "/");
  let className;
  if (typeof classNameProp === "function") {
    className = classNameProp({
      isActive
    });
  } else {
    className = [classNameProp, isActive ? "active" : null].filter(Boolean).join(" ");
  }
  let style = typeof styleProp === "function" ? styleProp({
    isActive
  }) : styleProp;
  return (
    <Link {...rest} className={className} style={style} to={to}>
      {children}
    </Link>
  );
};

export function Navigate({to}){
  //  就是history.push
  let navigate =  useNavigate();
  React.useEffect(()=>{
    navigate(to);
  });
  return null;
}


/**
 * A `<Router>` for use in web browsers. Stores the location in the hash
 * portion of the URL so it is not sent to the server.
 * 一个Router用浏览器上，保存在hash,
 */
// function HashRouter(_ref2) { }

export {
  BrowserRouter,
  HashRouter
};