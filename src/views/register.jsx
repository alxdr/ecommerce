import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const Register = React.memo(props => {
  const { auth } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (document.querySelectorAll("input.is-valid").length === 4) {
      document
        .querySelector("button[aria-label='Register']")
        .removeAttribute("disabled");
    } else {
      document
        .querySelector("button[aria-label='Register']")
        .setAttribute("disabled", "true");
    }
  });

  const register = () => {
    const token = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    axios
      .post(
        "/register",
        {
          username,
          password,
          email
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
          const validatedUsername = document.getElementById("registerUsername");
          const validatedPassword = document.getElementById("registerPassword");
          const validatedPassword2 = document.getElementById(
            "registerPassword2"
          );
          const validatedEmail = document.getElementById("registerEmail");
          const invalidNameFB = document.getElementById("invalidUsername");
          const nameTakenFB = document.getElementById("nameTaken");
          const invalidPasswordFB = document.getElementById("invalidPassword");
          if (!data.username) {
            validatedUsername.classList.add("is-invalid");
            validatedUsername.classList.remove("is-valid");
            invalidNameFB.classList.replace("text-muted", "invalid-feedback");
          } else {
            validatedUsername.classList.remove("is-invalid");
            validatedUsername.classList.add("is-valid");
            invalidNameFB.classList.replace("invalid-feedback", "text-muted");
          }
          if (!data.nameTaken) {
            nameTakenFB.classList.add("d-none");
          } else {
            nameTakenFB.classList.remove("d-none");
          }
          if (!data.password) {
            validatedPassword.classList.add("is-invalid");
            validatedPassword.classList.remove("is-valid");
            validatedPassword2.classList.add("is-invalid");
            validatedPassword2.classList.remove("is-valid");
            invalidPasswordFB.classList.replace(
              "text-muted",
              "invalid-feedback"
            );
          } else {
            validatedPassword.classList.remove("is-invalid");
            validatedPassword.classList.add("is-valid");
            validatedPassword2.classList.remove("is-invalid");
            validatedPassword2.classList.add("is-valid");
            invalidPasswordFB.classList.replace(
              "invalid-feedback",
              "text-muted"
            );
          }
          if (!data.email) {
            validatedEmail.classList.add("is-invalid");
            validatedEmail.classList.remove("is-valid");
          } else {
            validatedEmail.classList.remove("is-invalid");
            validatedEmail.classList.add("is-valid");
          }
        }
      );
  };

  const handleChangeEmail = event => {
    const element = event.target;
    const nextEmail = element.value;
    const pattern = new RegExp(element.pattern);
    if (pattern.test(email)) {
      element.classList.remove("is-invalid");
      element.classList.add("is-valid");
    } else {
      element.classList.remove("is-valid");
      element.classList.add("is-invalid");
    }
    setEmail(nextEmail);
  };

  const handleChangePassword = event => {
    const element = event.target;
    const nextPassword = element.value;
    const invalidPasswordFB = document.getElementById("invalidPassword");
    if (
      password.length >= element.minLength &&
      password.length <= element.maxLength
    ) {
      element.classList.remove("is-invalid");
      element.classList.add("is-valid");
      invalidPasswordFB.classList.replace("invalid-feedback", "text-muted");
    } else {
      element.classList.remove("is-valid");
      element.classList.add("is-invalid");
      invalidPasswordFB.classList.replace("text-muted", "invalid-feedback");
    }
    const confirm = document.getElementById("registerPassword2");
    if (
      password2.length >= confirm.minLength &&
      password2.length <= confirm.maxLength &&
      password === password2
    ) {
      confirm.classList.remove("is-invalid");
      confirm.classList.add("is-valid");
    } else {
      confirm.classList.remove("is-valid");
      confirm.classList.add("is-invalid");
    }
    setPassword(nextPassword);
  };

  const handleChangePassword2 = event => {
    const element = event.target;
    const nextPassword2 = element.value;
    if (
      password2.length >= element.minLength &&
      password2.length <= element.maxLength &&
      password2 === password
    ) {
      element.classList.remove("is-invalid");
      element.classList.add("is-valid");
    } else {
      element.classList.remove("is-valid");
      element.classList.add("is-invalid");
    }
    setPassword2(nextPassword2);
  };

  const handleChangeUsername = event => {
    const element = event.target;
    const nextUsername = element.value;
    const pattern = new RegExp(element.pattern);
    const invalidNameFB = document.getElementById("invalidUsername");
    if (
      username.length >= element.minLength &&
      username.length <= element.maxLength &&
      pattern.test(username)
    ) {
      element.classList.remove("is-invalid");
      element.classList.add("is-valid");
      invalidNameFB.classList.replace("invalid-feedback", "text-muted");
    } else {
      element.classList.remove("is-valid");
      element.classList.add("is-invalid");
      invalidNameFB.classList.replace("text-muted", "invalid-feedback");
    }
    setUsername(nextUsername);
  };

  return (
    <div className="row justify-content-center mt-5">
      <form
        action="/register"
        method="post"
        className="d-inline-flex flex-column align-items-center w-50"
        noValidate
      >
        <label htmlFor="registerEmail" className="w-100">
          <span>Email: </span>
          <input
            className="form-control"
            type="email"
            name="email"
            id="registerEmail"
            onChange={handleChangeEmail}
            value={email}
            pattern="^[.\w-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$"
            autoComplete="email"
            required
          />
          <div className="invalid-feedback">
            A valid email address is required.
          </div>
        </label>
        <label htmlFor="registerUsername" className="w-100">
          <span>Username: </span>
          <input
            className="form-control"
            type="text"
            name="username"
            id="registerUsername"
            onChange={handleChangeUsername}
            value={username}
            pattern="[\w-]{8,16}"
            maxLength="16"
            minLength="8"
            autoComplete="username"
            required
          />
          <div className="invalid-feedback d-none" id="nameTaken">
            This username is taken. Please choose another username.
          </div>
          <small className="form-text text-muted" id="invalidUsername">
            Your username must be 8-16 characters long, and only contain
            letters, numbers or underscore.
          </small>
        </label>
        <label htmlFor="registerPassword" className="w-100">
          <span>Password: </span>
          <input
            className="form-control"
            type="password"
            name="password"
            id="registerPassword"
            onChange={handleChangePassword}
            value={password}
            maxLength="16"
            minLength="8"
            autoComplete="off"
            required
          />
          <small className="form-text text-muted" id="invalidPassword">
            Your password must be 8-16 characters long.
          </small>
        </label>
        <label htmlFor="registerPassword2" className="w-100">
          <span>Confirm Password: </span>
          <input
            className="form-control"
            type="password"
            name="password2"
            id="registerPassword2"
            onChange={handleChangePassword2}
            value={password2}
            maxLength="16"
            minLength="8"
            autoComplete="off"
            required
          />
          <div className="invalid-feedback">
            Please ensure both passwords are the same.
          </div>
        </label>
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={register}
          aria-label="Register"
        >
          Register
        </button>
      </form>
    </div>
  );
});

Register.propTypes = {
  auth: PropTypes.func.isRequired
};

export default Register;
