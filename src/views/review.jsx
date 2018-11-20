import React from "react";

const Review = React.memo(props => {
  const {
    review: {
      review: {
        text,
        author: { username }
      },
      productName
    }
  } = props;
  return (
    <div className="row justify-content-center">
      <div className="card">
        <div className="card-header">{`Review of ${productName}`}</div>
        <div className="card-body">
          <div className="card-text">{text}</div>
        </div>
        <div className="card-footer d-flex justify-content-end">
          {`By: ${username}`}
        </div>
      </div>
    </div>
  );
});

export default Review;
