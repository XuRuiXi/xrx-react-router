import React from 'react';

class User extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return (
      <h1>
        User
      </h1>
    );
  }
}

export default User;