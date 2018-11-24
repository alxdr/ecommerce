import React from "react";

const Voter = React.memo(({ vote, id, type, voteCount }) => (
  <div className="voter">
    <span
      className="fas fa-arrow-up fa-lg btn"
      onClick={vote}
      onKeyDown={vote}
      data-vote="up"
      data-id={id}
      data-type={type}
      role="button"
      tabIndex="0"
      aria-label="up vote"
    />
    {voteCount}
    <span
      className="fas fa-arrow-down fa-lg btn"
      onClick={vote}
      onKeyDown={vote}
      data-vote="down"
      data-id={id}
      data-type={type}
      role="button"
      tabIndex="0"
      aria-label="down vote"
    />
  </div>
));

export default Voter;
