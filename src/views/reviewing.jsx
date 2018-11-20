import React from "react";
import axios from "axios";
import PropTypes from "prop-types";

class Reviewing extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      complete: false,
      text: ""
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
    const {
      reviewing: { pid, tid },
      showError
    } = this.props;
    const { text } = this.state;
    const token = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    axios
      .post(
        `/product/${pid}/reviews/${tid}`,
        { text },
        {
          xsrfHeaderName: "csrf-token",
          headers: {
            "csrf-token": token
          }
        }
      )
      .then(() => {
        this.setState({
          complete: true
        });
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
    const { complete, text } = this.state;
    const {
      reviewing: { pid, tid }
    } = this.props;
    if (complete) {
      return (
        <div className="alert alert-success text-center" role="alert">
          <span className="fas fa-check-circle">
            <strong> Success</strong>
          </span>
        </div>
      );
    }
    return (
      <div className="row justify-content-center">
        <form
          action={`/product/${pid}/reviews/${tid}`}
          method="post"
          className="w-50 d-flex flex-column justify-content-center align-items-end"
        >
          <label htmlFor="review" className="w-100">
            <span>Review: </span>
            <textarea
              id="text"
              name="text"
              className="form-control"
              value={text}
              onChange={this.handleChange}
            />
          </label>
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.submit}
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
}

Reviewing.propTypes = {
  reviewing: PropTypes.objectOf(PropTypes.string).isRequired,
  showError: PropTypes.func.isRequired
};

export default Reviewing;
