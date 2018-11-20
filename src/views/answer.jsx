import React from "react";
import axios from "axios";
import PropTypes from "prop-types";

class Answer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit(event) {
    event.preventDefault();
    const {
      answer: { threadId, pid },
      showError
    } = this.props;
    const { text } = this.state;
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

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    const {
      answer: { question }
    } = this.props;
    const { text, complete } = this.state;
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
        <table className="table table-borderless table-sm">
          <tbody>
            <tr>
              <th>Question:</th>
              <td>{question}</td>
            </tr>
            <tr>
              <th>Answer:</th>
              <td className="d-flex flex-column align-items-end">
                <textarea
                  id="text"
                  name="text"
                  className="form-control mb-2"
                  value={text}
                  onChange={this.handleChange}
                />
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={this.submit}
                >
                  Submit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

Answer.propTypes = {
  answer: PropTypes.objectOf(PropTypes.string).isRequired,
  showError: PropTypes.func.isRequired
};

export default Answer;
