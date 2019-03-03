/* eslint-disable camelcase, jsx-a11y/label-has-for */
import React, { useState, useReducer } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { CardElement, injectStripe } from "react-stripe-elements";
import countryList from "country-list";

const initialAddress = {
  name: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postal: "",
  country: "United States"
};

const initialState = {
  shipping: initialAddress,
  billing: initialAddress
};

function reducer(state, action) {
  return {
    ...state,
    [action.address]: {
      ...state[action.address],
      [action.type]: action.data
    }
  };
}

const countries = countryList.getNames();

const CheckOut = React.memo(props => {
  const { stripe, amount, cart, showError, clearCart, complete } = props;
  const [isSame, setIsSame] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { shipping, billing } = state;
  const setSameAddress = event => {
    const {
      target: { checked }
    } = event;
    const billingForm = document.getElementById("billing");
    if (checked) {
      billingForm.classList.toggle("d-none");
      setIsSame(prevValue => !prevValue);
    } else {
      billingForm.classList.toggle("d-none");
    }
  };
  const validateShipping = () => {
    if (shipping.name.length === 0) return false;
    if (shipping.address1.length === 0) return false;
    if (shipping.postal.length === 0) return false;
    if (countryList.getCode(shipping.country) === undefined) return false;
    return true;
  };
  const validateBilling = () => {
    if (billing.name.length === 0) return false;
    if (billing.address1.length === 0) return false;
    if (billing.postal.length === 0) return false;
    if (countryList.getCode(billing.country) === undefined) return false;
    return true;
  };

  const handleSubmit = async event => {
    let address = "billing";
    if (isSame) address = "shipping";
    const {
      [address]: {
        name,
        address1: address_line1,
        address2: address_line2,
        city: address_city,
        state: address_state,
        postal: address_zip,
        country: address_country
      }
    } = state;

    if ((!isSame && !validateBilling()) || !validateShipping()) {
      const warning = document.querySelector("#warning");
      warning.classList.remove("d-none");
      warning.scrollIntoView();
      return;
    }
    event.currentTarget.setAttribute("disabled", true);
    const spinner = document.querySelector("#spinner");
    spinner.classList.remove("d-none");
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    try {
      const { token, error } = await stripe.createToken({
        name,
        address_line1,
        address_line2,
        address_city,
        address_state,
        address_zip,
        address_country: countryList.getCode(address_country)
      });
      if (error) throw error;
      await axios.post(
        "/checkout",
        {
          token: token.id,
          amount,
          cart,
          shipping
        },
        {
          xsrfHeaderName: "csrf-token",
          headers: {
            "csrf-token": csrfToken
          }
        }
      );
      clearCart();
      complete();
    } catch (error) {
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
    }
  };

  const handleChange = event =>
    dispatch({
      address: event.target.dataset.address,
      type: event.target.name,
      data: event.target.value
    });

  return (
    <>
      <div className="row justify-content-center">
        <div className="checkout card">
          <div className="card-header">Shipping Info</div>
          <div className="card-body d-flex flex-column align-items-center">
            <label htmlFor="name" className="w-100">
              <span>
                Full Name
                <sup>*</sup>
              </span>
              <br />
              <input
                type="text"
                className="form-control"
                name="name"
                data-address="shipping"
                id="name"
                value={shipping.name}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="address1" className="w-100">
              <span>
                {"Address Line 1"}
                <sup>*</sup>
              </span>
              <br />
              <input
                type="text"
                className="form-control"
                name="address1"
                data-address="shipping"
                id="address1"
                value={shipping.address1}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="address2" className="w-100">
              <span>Address Line 2</span>
              <br />
              <input
                type="text"
                className="form-control"
                name="address2"
                data-address="shipping"
                id="address2"
                value={shipping.address2}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="city" className="w-100">
              <span>City</span>
              <br />
              <input
                type="text"
                className="form-control"
                name="city"
                data-address="shipping"
                id="city"
                value={shipping.city}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="state" className="w-100">
              <span>State / Province</span>
              <br />
              <input
                type="text"
                className="form-control"
                name="state"
                data-address="shipping"
                id="state"
                value={shipping.state}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="postal" className="w-100">
              <span>
                ZIP / Postal Code
                <sup>*</sup>
              </span>
              <br />
              <input
                type="text"
                className="form-control"
                name="postal"
                data-address="shipping"
                id="postal"
                value={shipping.postal}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="country" className="w-100">
              <span>
                Country
                <sup>*</sup>
              </span>
              <br />
              <select
                className="form-control"
                name="country"
                data-address="shipping"
                id="country"
                value={shipping.country}
                onChange={handleChange}
              >
                {countries.map(name => (
                  <option value={name} key={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="checkout card">
          <div className="card-header">Billing Info</div>
          <div className="card-body d-flex flex-column align-items-center">
            <div className="form-check input-group mb-3">
              <label className="form-check-label" htmlFor="same_address">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="same_address"
                  onChange={setSameAddress}
                />
                Same as Shipping Info
              </label>
            </div>
            <div className="input-group" id="billing">
              <label htmlFor="bill_name" className="w-100">
                <span>
                  Full Name
                  <sup>*</sup>
                </span>
                <br />
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  data-address="billing"
                  id="bill_name"
                  value={billing.name}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="bill_address1" className="w-100">
                <span>
                  {"Address Line 1"}
                  <sup>*</sup>
                </span>
                <br />
                <input
                  type="text"
                  className="form-control"
                  name="address1"
                  data-address="billing"
                  id="bill_address1"
                  value={billing.address1}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="bill_address2" className="w-100">
                <span>Address Line 2</span>
                <br />
                <input
                  type="text"
                  className="form-control"
                  name="address2"
                  data-address="billing"
                  id="bill_address2"
                  value={billing.address2}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="bill_city" className="w-100">
                <span>City</span>
                <br />
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  data-address="billing"
                  id="bill_city"
                  value={billing.city}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="bill_state" className="w-100">
                <span>State / Province</span>
                <br />
                <input
                  type="text"
                  className="form-control"
                  name="state"
                  data-address="billing"
                  id="bill_state"
                  value={billing.state}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="bill_postal" className="w-100">
                <span>
                  ZIP / Postal Code
                  <sup>*</sup>
                </span>
                <br />
                <input
                  type="text"
                  className="form-control"
                  name="postal"
                  data-address="billing"
                  id="bill_postal"
                  value={billing.postal}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="bill_country" className="w-100">
                <span>
                  Country
                  <sup>*</sup>
                </span>
                <br />
                <select
                  className="form-control"
                  name="country"
                  data-address="billing"
                  id="bill_country"
                  value={billing.country}
                  onChange={handleChange}
                >
                  {countries.map(name => (
                    <option value={name} key={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="checkout card">
          <div className="card-header">
            Debit or Credit Card
            <sup>*</sup>
          </div>
          <div className="card-body">
            <CardElement />
          </div>
          <div className="card-footer d-flex justify-content-end align-items-center">
            <span>
              <strong>{`Total: $${amount}`}</strong>
            </span>
            <button
              type="button"
              className="btn btn-primary ml-3"
              onClick={handleSubmit}
            >
              <span className="fas fa-spinner fa-pulse d-none" id="spinner" />
              <span> Send</span>
            </button>
          </div>
        </div>
      </div>
      <div className="row justify-content-center d-none mt-2" id="warning">
        <div className="alert alert-danger text-center w-50" role="alert">
          {"Please complete all "}
          <strong>
            required
            <sup>*</sup>
          </strong>
          {" fields."}
        </div>
      </div>
    </>
  );
});

CheckOut.propTypes = {
  amount: PropTypes.string.isRequired,
  cart: PropTypes.arrayOf(PropTypes.string).isRequired,
  showError: PropTypes.func.isRequired,
  clearCart: PropTypes.func.isRequired,
  complete: PropTypes.func.isRequired
};

export default injectStripe(CheckOut);
