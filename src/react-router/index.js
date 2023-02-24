import React from 'react';
//导航上下文
const NavigationContext = React.createContext({});
//路径上下文
const LocationContext = React.createContext({});
//路由上下文
const RouteContext = React.createContext({});

export {
  NavigationContext,
  LocationContext,
  RouteContext
};
//提供数据
export function Router({ children, location, navigator }) {

  return (
    <NavigationContext.Provider value={{ navigator }}>
      <LocationContext.Provider value={{ location }} >
        {children}
      </LocationContext.Provider>
    </NavigationContext.Provider>
  );
}


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
      return React.cloneElement(element, { ...element.props, match });
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

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function Route() {}

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

export function useNavigate() {
  let { navigator } = React.useContext(NavigationContext);
  let navigate = React.useCallback((to) => {
    navigator.push(to);
  }, [navigator]);
  return navigate;
}

