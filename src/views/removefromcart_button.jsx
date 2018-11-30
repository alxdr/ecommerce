import React from "react";
import PropTypes from "prop-types";

const RemoveFromCartButton = React.memo(props => (
  <button
    type="button"
    className="btn btn-danger mb-2"
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
