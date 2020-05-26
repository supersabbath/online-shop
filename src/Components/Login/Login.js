import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Auth from "../../Auth";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { setLoggedInUser } from "../../Redux/Actions";
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import  { signin , signup } from './../../Redux/Commands/auth';
import { useFirebase, isLoaded, isEmpty } from 'react-redux-firebase'

class ConnectedLogin extends Component {
  state = {
    userName: "",
    pass: "",
    redirectToReferrer: false
  };
  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };

    // If user was authenticated, redirect her to where she came from.
    if (this.state.redirectToReferrer === true) {
      return <Redirect to={from} />;
    }

    return (
      <div style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",

        alignItems: "center",
      }}>
        <div
          style={{
            height: 300,
            width: 200,
            padding: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
          }}
        >
          <Avatar style={{ marginBottom: 10 }}>
            <LockOutlinedIcon />
          </Avatar>
          <div
            style={{
              marginBottom: 20,
              fontSize: 24,
              textAlign: "center"
            }}
          >
            {" "}
            Log in
            {" "}
          </div>
          <TextField
            value={this.state.userName}
            placeholder="User name"
            onChange={e => {
              this.setState({ userName: e.target.value });
            }}
          />
          <TextField
            value={this.state.pass}
            type="password"
            placeholder="Password"
            onChange={e => {
              this.setState({ pass: e.target.value });
            }}
          />
          <Button
            style={{ marginTop: 20, width: 200 }}
            variant="outlined"
            color="primary"
            onClick={() => {
  
              this.props.login(this.state.userName, this.state.pass, user => {
                console.debug('aqyu')
                if (!user) {
                  this.setState({ wrongCred: true });
                  return;
                }
  
                this.props.dispatch(setLoggedInUser({ name: user.name }));
                this.setState(() => ({
                  redirectToReferrer: true
                }));
              })
            }}
          >
            Log in
          </Button>
          <Button
          style={{ marginTop: 20, width: 200 }}
          variant="outlined"
          color="primary"
          onClick={() => {
            this.props.signup(this.state.userName, this.state.pass);
          }}
        >
          Crear una cuenta
        </Button>
          {this.state.wrongCred && (
            <div style={{ color: "red" }}>Wrong username and/or password</div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch, state) => {
  return {
    // dispatching plain actions
    login: (user, pw, cb) => dispatch(signin(user,pw,cb)),
    signup: (user, pw) => dispatch(signup(user,pw)),
  }
};

const Login = withRouter(connect(mapStateToProps,mapDispatchToProps)(ConnectedLogin));
export default Login;
