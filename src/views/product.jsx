import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Link from "./link";
import Voter from "./voter";

class Product extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      thread: [],
      reviews: [],
      ask: ""
    };
    this.loadReviews = this.loadReviews.bind(this);
    this.loadThread = this.loadThread.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.ask = this.ask.bind(this);
    this.vote = this.vote.bind(this);
  }

  componentWillMount() {
    this.loadReviews();
    this.loadThread();
  }

  loadReviews() {
    const {
      product: { _id: id }
    } = this.props;
    const { showError } = this.props;
    axios
      .get(`/product/${id}/reviews`)
      .then(response => {
        const { reviews } = response.data;
        this.setState({ reviews });
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

  loadThread() {
    const {
      product: { _id: id }
    } = this.props;
    const { showError } = this.props;
    axios
      .get(`/product/${id}/thread`)
      .then(response => {
        const { thread } = response.data;
        this.setState({ thread });
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

  ask(event) {
    event.preventDefault();
    const { ask } = this.state;
    const {
      showError,
      product: { _id: id }
    } = this.props;
    const token = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    axios
      .post(
        `/product/${id}/thread`,
        { text: ask },
        {
          xsrfHeaderName: "csrf-token",
          headers: {
            "csrf-token": token
          }
        }
      )
      .then(this.loadThread)
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

  vote(event) {
    const { showError } = this.props;
    const {
      target: {
        dataset: { id, vote, type }
      }
    } = event;
    const token = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    axios
      .post(
        `/vote/${vote}/${type}/${id}`,
        {},
        {
          xsrfHeaderName: "csrf-token",
          headers: {
            "csrf-token": token
          }
        }
      )
      .then(() => {
        if (type === "thread") {
          this.loadThread();
        }
        if (type === "review") {
          this.loadReviews();
        }
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
    const {
      product: { imageSrc, productName, department, price, text, _id: pid }
    } = this.props;
    const { thread, reviews, ask } = this.state;
    const reviewsSection =
      reviews.length === 0
        ? null
        : reviews.map(review => {
            const {
              _id: reviewId,
              votes,
              text: reviewText,
              createdDate,
              author: { username }
            } = review;
            return (
              <div key={reviewId} className="d-flex justify-content-start">
                <Voter
                  vote={this.vote}
                  id={reviewId}
                  type="review"
                  voteCount={votes}
                />
                <div className="review ml-3">
                  <span className="font-weight-bold mr-2">{username}</span>
                  <span className="text-muted">
                    {new Date(createdDate).toLocaleDateString()}
                  </span>
                  <p>{reviewText}</p>
                </div>
              </div>
            );
          });
    const threadSection =
      thread.length === 0
        ? null
        : thread.map(msg => {
            const {
              replies,
              _id: id,
              votes,
              text: msgText,
              author: { username },
              createdDate
            } = msg;
            return (
              <div key={id} className="grid-container">
                <Voter
                  vote={this.vote}
                  id={id}
                  type="thread"
                  voteCount={votes}
                />
                <div className="question">
                  <div className="title">
                    <strong className="fullText">Question:</strong>
                    <strong className="shortText">Q:</strong>
                  </div>
                  <div>
                    <Link
                      href="/answer"
                      data={{
                        answer: { threadId: id, pid, question: msg.text }
                      }}
                    >
                      <p>{msgText}</p>
                    </Link>
                    <span>
                      {`By ${username} on ${new Date(
                        createdDate
                      ).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
                <div className="answer">
                  <div className="title">
                    <strong className="fullText">
                      {replies.length > 0 ? "Answer:" : null}
                    </strong>
                    <strong className="shortText">A:</strong>
                  </div>
                  <div className="grid-column">
                    {replies.map(reply => {
                      const {
                        _id: replyId,
                        author: { username: replyUsername },
                        createdDate: replyDate
                      } = reply;
                      return (
                        <div key={replyId}>
                          <p>{reply.text}</p>
                          <span>
                            {`By ${replyUsername} on ${new Date(
                              replyDate
                            ).toLocaleDateString()}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          });

    const formSection = (
      <form className="d-inline-flex justify-content-start">
        <label htmlFor="ask" className="mr-2 mb-1">
          <span className="fas fa-question-circle"> Ask us anything</span>
          <input
            type="text"
            id="ask"
            name="ask"
            className="form-control"
            value={ask}
            size="80"
            onChange={this.handleChange}
          />
        </label>
        <div className="form-group d-inline-flex flex-column justify-content-end mb-2">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={this.ask}
          >
            Ask
          </button>
        </div>
      </form>
    );
    return (
      <div className="card d-flex flex-column justify-content-around align-items-center my-2">
        <img className="img-fluid" src={imageSrc} alt={productName} />
        <div className="card-body">
          <h5 className="card-title">{productName}</h5>
          <h6 className="card-subtitle mb-2">{department}</h6>
          <h6 className="card-subtitle mb-2 text-muted">{`$${price}`}</h6>
          {text.length > 0 ? <p className="card-text mb-2">{text}</p> : null}
          <h3 className="card-subtitle mb-2">Questions & Answers</h3>
          {formSection}
          {threadSection}
          <h3 className="card-subtitle mb-2">Reviews</h3>
          {reviewsSection}
        </div>
      </div>
    );
  }
}

Product.propTypes = {
  product: PropTypes.shape({
    imageSrc: PropTypes.string,
    productName: PropTypes.string,
    department: PropTypes.string,
    price: PropTypes.string,
    text: PropTypes.string
  }).isRequired,
  showError: PropTypes.func.isRequired
};

export default Product;
