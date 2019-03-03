import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const Reviewing = React.memo(props => {
  const {
    reviewing: { pid, tid },
    showError
  } = props;
  const [isComplete, setIsComplete] = useState(false);
  const [text, setText] = useState("");

  const handleChange = event => setText(event.target.value);

  const handleSubmit = event => {
    event.preventDefault();
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
      .then(() => setIsComplete(true))
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
  };
  if (isComplete) {
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
        className="customForm d-flex flex-column justify-content-center align-items-end"
      >
        <label htmlFor="review" className="w-100">
          <span>Review: </span>
          <textarea
            id="text"
            name="text"
            className="form-control"
            value={text}
            onChange={handleChange}
          />
        </label>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
    </div>
  );
});

Reviewing.propTypes = {
  reviewing: PropTypes.objectOf(PropTypes.string).isRequired,
  showError: PropTypes.func.isRequired
};

export default Reviewing;
