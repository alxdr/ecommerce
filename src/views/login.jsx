import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const Login = React.memo(props => {
  const { auth } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    const token = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    axios
      .post(
        "/login",
        {
          username,
          password
        },
        {
          xsrfHeaderName: "csrf-token",
          headers: {
            "csrf-token": token
          }
        }
      )
      .then(
        res => {
          auth(res.data.connected);
        },
        err => {
          const { data } = err.response;
          if (!data.username) {
            document
              .getElementById("loginUsername")
              .classList.add("is-invalid");
          }
          if (!data.password) {
            document
              .getElementById("loginPassword")
              .classList.add("is-invalid");
          }
        }
      );
  };

  const handleChangePassword = event => setPassword(event.target.value);
  const handleChangeUsername = event => setUsername(event.target.value);

  return (
    <div className="row justify-content-center mt-5">
      <form
        action="/login"
        method="post"
        className="d-inline-flex flex-column align-items-center"
        noValidate
      >
        <div className="form-group">
          <label htmlFor="loginUsername">
            <span>Username: </span>
            <br />
            <input
              className="form-control"
              type="text"
              name="username"
              id="loginUsername"
              onChange={handleChangeUsername}
              value={username}
              pattern="[\w-]{8,16}"
              maxLength="16"
              minLength="8"
              autoComplete="username"
              required
            />
            <div className="invalid-feedback">Invalid username.</div>
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="loginPassword">
            <span>Password: </span>
            <br />
            <input
              className="form-control"
              type="password"
              name="password"
              id="loginPassword"
              onChange={handleChangePassword}
              value={password}
              maxLength="16"
              minLength="8"
              autoComplete="current-password"
              required
            />
            <div className="invalid-feedback">Invalid password.</div>
          </label>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={login}
          aria-label="Login"
        >
          Login
        </button>
      </form>
    </div>
  );
});

Login.propTypes = {
  auth: PropTypes.func.isRequired
};

export default Login;
