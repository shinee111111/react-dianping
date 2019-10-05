import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as loginActions, getUsername, getPassword, isLogin } from '../../redux/modules/login';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import { Redirect } from 'react-router-dom';

class Login extends Component {
  render() {
    // const { username, password, login, location: { state } } = this.props;
    const { username, password, login } = this.props;
    if (login) {
      // if (state && state.from) {
      //   return <Redirect to={state.from} />
      // }
      return <Redirect to='/user' />
    }
    return (
      <div>
        <LoginHeader />
        <LoginForm
          username={username}
          password={password}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }

  handleChange = (e) => {
    const { setUsername, setPassword } = this.props.loginActions;
    if (e.target.name === 'username') {
      setUsername(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  }

  handleSubmit = () => {
    this.props.loginActions.login();
  }

};

const mapStateToProps = (state, props) => {
  return {
    username: getUsername(state),
    password: getPassword(state),
    login: isLogin(state)
  };
};

const mapDispatchToProps = (dispatch, getState) => {
  return {
    loginActions: bindActionCreators(loginActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);