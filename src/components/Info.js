import React, { useEffect, useCallback, useState } from "react";

const Info = () => {
  const [count, setCount] = useState(0);
  const add = useCallback(() => {
    setCount(count => count + 1);
  }, []);
  return (
    <div>
      <button onClick={add}>dian</button>
      <h1>Info</h1>
      <div>{count}</div>
    </div>
  );
};

export default Info;
