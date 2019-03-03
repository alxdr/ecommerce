import React, { useState, useEffect, useCallback } from "react";
import qs from "qs";
import axios from "axios";
import PropTypes from "prop-types";
import { Elements, StripeProvider } from "react-stripe-elements";
import List from "./list";
import RemoveFromCartButton from "./removefromcart_button";
import CheckOut from "./checkout";

const ShoppingCart = React.memo(props => {
  const {
    checkOut,
    cart,
    showError,
    removeFromCart,
    clearCart,
    showCheckOut
  } = props;
  const [data, setData] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const getCartData = () => {
    axios
      .get(`/cart/${qs.stringify({ data: cart })}`)
      .then(res => setData(res.data))
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

  useEffect(
    () => {
      if (cart && cart.length > 0) {
        getCartData();
      } else {
        setData(null);
      }
    },
    [cart]
  );

  const completedPurchase = useCallback(() => setIsComplete(true));

  const cartRenderProp = useCallback(
    (_, __, index) => (
      <RemoveFromCartButton removeFromCart={removeFromCart} index={index} />
    ),
    [removeFromCart]
  );

  let render = null;
  if (data !== null) {
    const reducer = (acc, cur) => acc + parseFloat(cur.price);
    const amount = data.reduce(reducer, 0.0).toFixed(2);
    render = checkOut ? (
      <StripeProvider apiKey={process.env.STRIPE_PUBLIC}>
        <Elements>
          <CheckOut
            cart={cart}
            amount={amount}
            showError={showError}
            clearCart={clearCart}
            complete={completedPurchase}
          />
        </Elements>
      </StripeProvider>
    ) : (
      <>
        <List data={data} render={cartRenderProp} />
        <div className="row justify-content-end align-items-center">
          <span className="mr-3 mb-2">
            <strong>{`Total: $${amount}`}</strong>
          </span>
          <button
            type="button"
            className="btn btn-secondary mr-3 mb-2"
            onClick={clearCart}
          >
            Clear Cart
          </button>
          <button
            type="button"
            className="btn btn-primary mr-3 mb-2"
            onClick={showCheckOut}
          >
            Pay With Card
          </button>
        </div>
      </>
    );
  }
  if (isComplete) {
    return (
      <div className="alert alert-success text-center" role="alert">
        <span className="fas fa-check-circle">
          <strong> Purchase Complete</strong>
        </span>
      </div>
    );
  }
  return render;
});

ShoppingCart.propTypes = {
  cart: PropTypes.arrayOf(PropTypes.string).isRequired,
  removeFromCart: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
  showCheckOut: PropTypes.func.isRequired,
  clearCart: PropTypes.func.isRequired,
  checkOut: PropTypes.bool.isRequired
};

export default ShoppingCart;
