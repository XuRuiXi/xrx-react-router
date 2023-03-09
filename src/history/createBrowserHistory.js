function createBrowserHistory(){
  // window下的history对象
  const globalHistory = window.history;
  const history = {
    action:'POP',
    go,
    goBack,
    goForward,
    push,
    listen,
    location:{pathname:window.location.pathname,state:window.location.state}
  };
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
    console.log('pathname',pathname);
    console.log('state',state);
    globalHistory.pushState(state, null, pathname); // 我们已经 跳转路径
    let location = {
      state,
      pathname
    };
    notify({ action, location });
  }

  return history;
}
export default createBrowserHistory;
