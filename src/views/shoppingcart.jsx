import React from "react";
import qs from "qs";
import axios from "axios";
import PropTypes from "prop-types";
import { Elements, StripeProvider } from "react-stripe-elements";
import List from "./list";
import RemoveFromCartButton from "./removefromcart_button";
import CheckOut from "./checkout";

class ShoppingCart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      complete: false,
      checkOut: props.checkOut
    };
    this.cartRenderProp = this.cartRenderProp.bind(this);
    this.getCartData = this.getCartData.bind(this);
    this.completedPurchase = this.completedPurchase.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { data, checkOut: prevCheckOut } = state;
    const { cart, checkOut } = props;
    if (Array.isArray(data)) {
      if (data.length !== cart.length) {
        return { data: null, checkOut };
      }
      for (let i = 0; i < data.length; i++) {
        const { _id: id } = data[i];
        if (cart[i] !== id) return { data: null, checkOut };
      }
    }
    if (checkOut !== prevCheckOut) return { checkOut };
    return null;
  }

  componentDidMount() {
    const { cart } = this.props;
    if (cart.length > 0) this.getCartData();
  }

  componentDidUpdate() {
    const { data } = this.state;
    const { cart } = this.props;
    if (data === null && cart.length > 0) this.getCartData();
  }

  getCartData() {
    const { cart, showError } = this.props;
    axios
      .get(`/cart/${qs.stringify({ data: cart })}`)
      .then(res => this.setState({ data: res.data }))
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

  completedPurchase() {
    this.setState({ complete: true });
  }

  cartRenderProp(id) {
    const { removeFromCart } = this.props;
    return <RemoveFromCartButton removeFromCart={removeFromCart} id={id} />;
  }

  render() {
    const { data, checkOut, complete } = this.state;
    const { cart, showError, clearCart, showCheckOut } = this.props;
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
              complete={this.completedPurchase}
            />
          </Elements>
        </StripeProvider>
      ) : (
        <>
          <List data={data} render={this.cartRenderProp} />
          <div className="row justify-content-end align-items-center">
            <span>
              <strong>{`Total: $${amount}`}</strong>
            </span>
            <button
              type="button"
              className="btn btn-primary mx-3"
              onClick={showCheckOut}
            >
              Pay With Card
            </button>
          </div>
        </>
      );
    }
    if (complete) {
      return (
        <div className="alert alert-success text-center" role="alert">
          <span className="fas fa-check-circle">
            <strong> Purchase Complete</strong>
          </span>
        </div>
      );
    }
    return render;
  }
}

ShoppingCart.propTypes = {
  cart: PropTypes.arrayOf(PropTypes.string).isRequired,
  removeFromCart: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
  showCheckOut: PropTypes.func.isRequired,
  clearCart: PropTypes.func.isRequired,
  checkOut: PropTypes.bool.isRequired
};

export default ShoppingCart;
