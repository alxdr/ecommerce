import React from "react";
import PropTypes from "prop-types";

const Err = React.memo(props => {
  const { error } = props;
  const message =
    error instanceof Error ? (
      <p>{error.message}</p>
    ) : (
      <>
        {typeof error === "string" ? null : <h1>Something broke!</h1>}
        <p>{JSON.stringify(error)}</p>
      </>
    );
  return (
    <div className="row justify-content-center align-items-center">
      <div className="alert alert-danger" role="alert">
        {message}
      </div>
    </div>
  );
});

Err.defaultProps = {
  error: null
};

Err.propTypes = {
  error: PropTypes.node.isRequired
};

export default Err;
