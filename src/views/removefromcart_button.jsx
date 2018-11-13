import React from "react";
import PropTypes from "prop-types";

const RemoveFromCartButton = React.memo(props => (
  <button
    type="button"
    className="btn btn-light"
    onClick={() => props.removeFromCart(props.id)}
  >
    <span className="fas fa-trash"> Delete</span>
  </button>
));

RemoveFromCartButton.propTypes = {
  id: PropTypes.string.isRequired,
  removeFromCart: PropTypes.func.isRequired
};

export default RemoveFromCartButton;
