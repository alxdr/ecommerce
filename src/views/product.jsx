import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Link from "./link";

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
  }

  componentWillMount() {
    this.loadReviews();
    this.loadThread();
  }

  loadReviews() {
    const {
      product: { _id: id }
    } = this.props;
    axios.get(`/product/${id}/reviews`).then(response => {
      const { reviews } = response.data;
      this.setState({ reviews });
    });
  }

  loadThread() {
    const {
      product: { _id: id }
    } = this.props;
    axios.get(`/product/${id}/thread`).then(response => {
      const { thread } = response.data;
      this.setState({ thread });
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

  render() {
    const {
      product: { imageSrc, productName, department, price, text, _id: pid }
    } = this.props;
    const { thread, reviews, ask } = this.state;
    const reviewsComponent =
      reviews.length === 0
        ? null
        : reviews.map(review => {
            const { _id: reviewId } = review;
            return <p key={reviewId}>{review.text}</p>;
          });
    const threadComponent =
      thread.length === 0 ? null : (
        <div className="table-responsive">
          <table className="table table-borderless table-sm">
            <tbody>
              {thread.map(msg => {
                const { replies, _id: id } = msg;
                return (
                  <>
                    <tr key={id}>
                      <th>Question:</th>
                      <td>
                        <Link
                          href="/answer"
                          data={{
                            answer: { threadId: id, pid, question: msg.text }
                          }}
                        >
                          {msg.text}
                        </Link>
                      </td>
                    </tr>
                    {replies.map((reply, index) => {
                      const { _id: replyId } = reply;
                      return (
                        <tr key={replyId}>
                          <th>{index === 0 ? "Answer:" : null}</th>
                          <td>{reply.text}</td>
                        </tr>
                      );
                    })}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      );

    const formComponent = (
      <form className="d-inline-flex justify-content-start">
        <label htmlFor="ask" className="mr-2 mb-1">
          <span className="fas fa-question-circle"> Ask us anything</span>
          <input
            type="text"
            id="ask"
            name="ask"
            className="form-control"
            value={ask}
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
        <div className="card-body w-75">
          <h5 className="card-title">{productName}</h5>
          <h6 className="card-subtitle mb-2">{department}</h6>
          <h6 className="card-subtitle mb-2 text-muted">{`$${price}`}</h6>
          {text.length > 0 ? <p className="card-text mb-2">{text}</p> : null}
          <h5 className="card-subtitle mb-2">Questions & Answers</h5>
          {formComponent}
          {threadComponent}
          <h5 className="card-subtitle mb-2">Reviews</h5>
          {reviewsComponent}
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
