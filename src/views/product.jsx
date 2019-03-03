import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Link from "./link";
import Voter from "./voter";
import AddToCartButton from "./addtocart_button";

const Product = React.memo(props => {
  const {
    product: { imageSrc, productName, department, price, text, _id: id },
    showError,
    addToCart
  } = props;
  const [thread, setThread] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [ask, setAsk] = useState("");

  const loadReviews = () => {
    axios
      .get(`/product/${id}/reviews`)
      .then(response => {
        const { reviews: nextReviews } = response.data;
        setReviews(nextReviews);
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
  };

  const loadThread = () => {
    axios
      .get(`/product/${id}/thread`)
      .then(response => {
        const { thread: nextThread } = response.data;
        setThread(nextThread);
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
  };

  useEffect(() => {
    loadReviews();
    loadThread();
  }, []);

  const handleAsk = event => setAsk(event.target.value);

  const handleSubmit = event => {
    event.preventDefault();
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
      .then(loadThread)
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

  const vote = event => {
    const {
      target: {
        dataset: { id: typeId, vote: voteType, type }
      }
    } = event;
    const token = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    axios
      .post(
        `/vote/${voteType}/${type}/${typeId}`,
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
          loadThread();
        }
        if (type === "review") {
          loadReviews();
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
  };

  const reviewsSection =
    reviews.length === 0 ? (
      <div>No one has written a review for this product.</div>
    ) : (
      reviews.map(review => {
        const {
          _id: reviewId,
          votes,
          text: reviewText,
          createdDate,
          author: { username }
        } = review;
        return (
          <div key={reviewId} className="d-flex justify-content-start">
            <Voter vote={vote} id={reviewId} type="review" voteCount={votes} />
            <div className="review ml-3">
              <span className="font-weight-bold d-block">{username}</span>
              <span className="text-muted">
                {new Date(createdDate).toLocaleDateString()}
              </span>
              <p className="mb-0">{reviewText}</p>
            </div>
          </div>
        );
      })
    );
  const threadSection =
    thread.length === 0 ? (
      <div>No one has asked a question for this product.</div>
    ) : (
      thread.map(msg => {
        const {
          replies,
          _id: msgId,
          votes,
          text: msgText,
          author: { username },
          createdDate
        } = msg;
        return (
          <div key={msgId} className="grid-container">
            <Voter vote={vote} id={msgId} type="thread" voteCount={votes} />
            <div className="question">
              <div className="title">
                <strong className="fullText">Question:</strong>
                <strong className="shortText">Q:</strong>
              </div>
              <div>
                <Link
                  href="/answer"
                  data={{
                    answer: { threadId: msgId, pid: id, question: msg.text }
                  }}
                >
                  <p className="mb-0">{msgText}</p>
                </Link>
                <span className="font-weight-bold d-block">{username}</span>
                <span className="text-muted">
                  {new Date(createdDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="answer">
              <div className="title">
                {replies.length > 0 ? (
                  <>
                    <strong className="fullText">Answer:</strong>
                    <strong className="shortText">A:</strong>
                  </>
                ) : null}
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
                      <p className="mb-0">{reply.text}</p>
                      <span className="font-weight-bold d-block">
                        {replyUsername}
                      </span>
                      <span className="text-muted">
                        {new Date(replyDate).toLocaleDateString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })
    );

  const formSection = (
    <form className="d-inline-flex justify-content-start">
      <label htmlFor="ask" className="mr-2 mb-0">
        <span className="fas fa-question-circle"> Ask us anything</span>
        <input
          type="text"
          id="ask"
          name="ask"
          className="form-control"
          value={ask}
          size="80"
          onChange={handleAsk}
        />
      </label>
      <div className="form-group d-flex mb-0">
        <button
          type="button"
          className="btn btn-secondary align-self-end"
          onClick={handleSubmit}
        >
          Ask
        </button>
      </div>
    </form>
  );
  return (
    <div className="card my-2">
      <div className="card-header">
        <div className="d-flex justify-content-center my-1">
          <img className="productImage" src={imageSrc} alt={productName} />
        </div>
      </div>
      <div className="card-body">
        <h5 className="card-title">{productName}</h5>
        <h6 className="card-subtitle mb-2">{department}</h6>
        <h6 className="card-subtitle mb-2 text-muted">{`$${price}`}</h6>
        {text.length > 0 ? <p className="card-text mb-2">{text}</p> : null}
        <h3 className="card-subtitle mb-2">Questions & Answers</h3>
        {formSection}
        {threadSection}
        <h3 className="card-subtitle my-2">Reviews</h3>
        {reviewsSection}
      </div>
      <div className="card-footer d-flex justify-content-end">
        <AddToCartButton addToCart={addToCart} id={id} />
      </div>
    </div>
  );
});

Product.propTypes = {
  product: PropTypes.shape({
    imageSrc: PropTypes.string,
    productName: PropTypes.string,
    department: PropTypes.string,
    price: PropTypes.string,
    text: PropTypes.string
  }).isRequired,
  showError: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired
};

export default Product;
