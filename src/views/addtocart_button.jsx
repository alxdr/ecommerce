import React from "react";
import PropTypes from "prop-types";

const AddToCartButton = React.memo(props => {
  const success = React.createRef();
  return (
    <>
      <span className="d-none text-success" ref={success}>
        <span className="fas fa-check-circle"> Added to Cart</span>
      </span>
      <button
        type="button"
        className="btn btn-success"
        onClick={event => {
          event.currentTarget.classList.add("d-none");
          success.current.classList.remove("d-none");
          props.addToCart(props.id);
        }}
      >
        <span className="fas fa-cart-plus"> Add to Cart</span>
      </button>
    </>
  );
});

AddToCartButton.propTypes = {
  id: PropTypes.string.isRequired,
  addToCart: PropTypes.func.isRequired
};

export default AddToCartButton;
