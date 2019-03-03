import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const Answer = React.memo(props => {
  const {
    answer: { threadId, pid, question },
    showError
  } = props;
  const [text, setText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();
    const token = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    axios
      .post(
        `/product/${pid}/thread/${threadId}`,
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

  const handleChange = event => setText(event.target.value);

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
      <div className="grid-container mx-2 customForm">
        <div className="question">
          <div className="title">
            <strong className="fullText">Question:</strong>
            <strong className="shortText">Q:</strong>
          </div>
          <div>{question}</div>
        </div>
        <div className="answer">
          <div className="title">
            <strong className="fullText">Answer:</strong>
            <strong className="shortText">A:</strong>
          </div>
          <div className="d-flex flex-column align-items-end">
            <textarea
              id="text"
              name="text"
              className="form-control mb-2"
              value={text}
              onChange={handleChange}
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

Answer.propTypes = {
  answer: PropTypes.objectOf(PropTypes.string).isRequired,
  showError: PropTypes.func.isRequired
};

export default Answer;
