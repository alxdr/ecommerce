import React from "react";
import axios from "axios";
import PropTypes from "prop-types";

class Settings extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: ""
    };
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  submit(event) {
    event.preventDefault();
    const { showError } = this.props;
    const {
      currentTarget: {
        dataset: { type }
      }
    } = event;
    let value = null;
    if (type === "username") {
      ({ username: value } = this.state);
    }
    if (type === "email") {
      ({ email: value } = this.state);
    }
    if (type === "password") {
      ({ password: value } = this.state);
    }
    const token = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    axios
      .patch(
        `/edit/user/${type}`,
        { [type]: value },
        {
          xsrfHeaderName: "csrf-token",
          headers: {
            "csrf-token": token
          }
        }
      )
      .then(() => {
        const form = document.querySelector(
          `form[action='/edit/user/${type}']`
        );
        const alert = form.nextElementSibling;
        form.classList.add("d-none");
        alert.classList.remove("d-none");
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 401) {
            showError(Error("Sorry, you have to log in first."));
          } else {
            showError(error.response);
          }
        } else if (error.request) {
          showError(error.request);
        } else {
          showError(error);
        }
      });
  }

  render() {
    const { username, email, password } = this.state;
    return (
      <>
        <div className="row justify-content-center align-items-center my-2">
          <form action="/edit/user/username" method="patch">
            <label htmlFor="username" className="mb-1 mr-2">
              <span>Username: </span>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                value={username}
                onChange={this.handleChange}
              />
            </label>
            <button
              type="button"
              className="btn btn-primary mb-1"
              onClick={this.submit}
              data-type="username"
            >
              <span className="fas fa-pen"> Change</span>
            </button>
          </form>
          <div className="alert alert-success text-center d-none" role="alert">
            <span className="fas fa-check-circle">
              <strong> Success</strong>
            </span>
          </div>
        </div>
        <div className="row justify-content-center align-items-center my-2">
          <form action="/edit/user/email" method="patch">
            <label htmlFor="email" className="mb-1 mr-2">
              <span>Email Address: </span>
              <input
                type="text"
                id="email"
                name="email"
                className="form-control"
                value={email}
                onChange={this.handleChange}
              />
            </label>
            <button
              type="button"
              className="btn btn-primary mb-1"
              onClick={this.submit}
              data-type="email"
            >
              <span className="fas fa-pen"> Change</span>
            </button>
          </form>
          <div className="alert alert-success text-center d-none" role="alert">
            <span className="fas fa-check-circle">
              <strong> Success</strong>
            </span>
          </div>
        </div>
        <div className="row justify-content-center align-items-center my-2">
          <form action="/edit/user/password" method="patch">
            <label htmlFor="password" className="mb-1 mr-2">
              <span>Password: </span>
              <input
                type="text"
                id="password"
                name="password"
                className="form-control"
                value={password}
                onChange={this.handleChange}
              />
            </label>
            <button
              type="button"
              className="btn btn-primary mb-1"
              onClick={this.submit}
              data-type="password"
            >
              <span className="fas fa-pen"> Change</span>
            </button>
          </form>
          <div className="alert alert-success text-center d-none" role="alert">
            <span className="fas fa-check-circle">
              <strong> Success</strong>
            </span>
          </div>
        </div>
      </>
    );
  }
}

Settings.propTypes = {
  showError: PropTypes.func.isRequired
};

export default Settings;
