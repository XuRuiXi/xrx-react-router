### 从0实现react-router-dom

### 1.从router使用例子开始

./index.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from './react-router-dom';

import Home from './components/Home';
import User from './components/User';
import Profile from './components/Profile';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home title="悟空"></Home>}></Route>
      <Route path='/user' element={<User></User>}></Route>
      <Route path='/profile' element={<Profile></Profile>}></Route>
    </Routes>
  </BrowserRouter>
  ,
  document.getElementById('app')
);
```

### 2.BrowserRouter获取hitory数据并且给Router组件提供hitory数据

./react-router-dom.js

```js
import React from 'react';
import { Router } from '../react-router';
import { createBrowserHistory } from 'history';
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
```

### 3.Router使用context给子组件提供数据

./react-router.js

```js
//导航上下文
const NavigationContext = React.createContext({});
//路径上下文
const LocationContext = React.createContext({});
//提供数据
export function Router({ children, location, navigator }) {
  return (
    <NavigationContext.Provider value={ navigator }>
      <LocationContext.Provider value={{ location }} >
        {children}
      </LocationContext.Provider>
    </NavigationContext.Provider>
  );
}
```

### 4.Routes根据当前路由信息，匹配组件正确渲染

./react-router.js

```js
//路由表
export function Routes({ children }) {
  return useRoutes(createRoutesFromChildren(children));
}

// 根据Context获取到对应的数据
export function useLocation() {
  return React.useContext(LocationContext).location;
}

//根据路由表找当的路径 有就渲染
export function useRoutes(routes) {
  // 根据Context获取到对应的数据
  let location = useLocation(); // 当前的路径对象
  let pathname = location.pathname || "/"; // 当前的路径
  for (let i = 0; i < routes.length; i++) {
    let { path, element } = routes[i];
    let match = matchPath(path, pathname);
    if (match) {
      return element;
    }
  }
  return null;
}

//获取到路由表
export function createRoutesFromChildren(children) {
  let routes = [];
  React.Children.forEach(children, element => {
    let route = {
      path: element.props.path,
      element: element.props.element
    };
    routes.push(route);
  });
  return routes;
}

function compilePath(path) {
  let paramNames = [];
  let regexpSource = "^" + path
    .replace(/:(\w+)/g, (_, key) => {
      paramNames.push(key);
      return "([^\\/]+)";
    });
  regexpSource += "$";
  
  if (regexpSource === '^*$') regexpSource = '^.*$';

  let matcher = new RegExp(regexpSource);
  return [matcher, paramNames];
}

export function matchPath(path, pathname) {

  let [matcher, paramNames] = compilePath(path);
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let values = match.slice(1);
  let params = paramNames.reduce(
    (memo, paramName, index) => {
      memo[paramName] = values[index];
      return memo;
    },
    {}
  );
  return { params, pathname: matchedPathname, path };
}
```

### 5.实现history

./history.js

```js
function createBrowserHistory(){
  // window下的history对象
  const globalHistory = window.history;

  // 存放所有的监听函数
  let listeners = [];
  let state;
  function listen(listener){
    listeners.push(listener);
    return ()=>{
      listeners = listeners.filter(item=>item !== listener);
    };
  }

  function go(n){
    globalHistory.go(n);
  }

  window.addEventListener('popstate',()=>{
    let location = {
      state: globalHistory.state,
      pathname: window.location.pathname
    };

    //当路径改变之后应该让history的监听函数执行，重新刷新组件
    notify({
      action: "POP",
      location
    });
  });

  function goBack(){
    go(-1);
  }

  function goForward(){
    go(1);
  }

  function notify(newState){
    //把newState上的属性赋值到history对象上
    Object.assign(history, newState);
    history.length = globalHistory.length;//路由历史栈中历史条目的长度
    listeners.forEach(listener => listener({ location: history.location }));
  }

  function push(pathname,nextState){
    const action = 'PUSH'; // action表示是由于什么样的动作引起了路径的变更
    if(typeof pathname === 'object'){
      state = pathname.state;
      pathname = pathname.pathname;
    }else{
      state = nextState; 
    }
    globalHistory.pushState(state, null, pathname); // 我们已经 跳转路径
    let location = {
      state,
      pathname
    };
    notify({ action, location });
  }
  const history = {
    action:'POP',
    go,
    goBack,
    goForward,
    push,
    listen,
    location:{pathname:window.location.pathname,state:window.location.state}
  };
  return history;
}
export default createBrowserHistory;

```

./history.js

```js
/**
 * hash不能使用 浏览器的history对象了
 * @returns 
 */
function createHashHistory(){
    let stack = [];//类似于历史栈 里面存放都是路径
    let index = -1;//栈的指针，默认是-1
    let action = 'POP';//动作
    let state ;//最新的状态 
    let listeners = [];//监听函数的数组
    function listen(listener){
        listeners.push(listener);
        return ()=>{
            listeners = listeners.filter(item=>item!=listener);
        }
    }
    function go(n){
        action = 'POP';
        index+=n;//更改栈顶的指针
        let nextLocation = stack[index];//取出指定索引对应的路径对象
        state= nextLocation.state;//取出此location对应的状态 
        window.location.hash = nextLocation.pathname;//修改hash值 ，从而修改当前的路径
    }
    let hashChangeHandler = ()=>{
        let pathname = window.location.hash.slice(1);//取出最新的hash值对应的路径  #/user
        Object.assign(history,{action,location:{pathname,state}});
        if(action === 'PUSH'){//说明是调用push方法，需要往历史栈中添加新的条目 
            stack[++index]=history.location;
        }
         listeners.forEach(listener => listener({ location: history.location }));
    }
    function push(pathname,nextState){
        action = 'PUSH';
        if(typeof pathname ==='object'){
            state = pathname.state;
            pathname = pathname.pathname
        }else{
            state = nextState;
        }
        window.location.hash = pathname;
    }
    //当hash发生变化的话，会执行回调
    window.addEventListener('hashchange',hashChangeHandler);
    function goBack(){
        go(-1);
    }
    function goForward(){
        go(1);
    }
    const history = {
        action:'POP',
        go,
        goBack,
        goForward,
        push,
        listen,
        location:{},
        location:{pathname:'/',state:undefined}
    }
    if(window.location.hash){//如果初始的情况下，如果hash是有值的
        action = 'PUSH';
        hashChangeHandler();
    }else{
        window.location.hash = '/';
    }
    return history;
}
export default createHashHistory;
```

### 6.实现Link

./react-router-dom.js
```js
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

```

./react-router.js
```js
export function useNavigate() {
  let { navigator } = React.useContext(NavigationContext);
  let navigate = React.useCallback((to) => {
    navigator.push(to);
  }, [navigator]);
  return navigate;
}
```

### 6.实现NavLink

./react-router-dom.js
```js
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
```


### 7.实现Navigate  


./react-router-dom.js
```js
export function Navigate({to}){
  //  就是history.push
  let navigate =  useNavigate();
  React.useEffect(()=>{
    navigate(to);
  });
  return null;
}
```