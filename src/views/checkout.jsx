/* eslint-disable camelcase, jsx-a11y/label-has-for */
import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { CardElement, injectStripe } from "react-stripe-elements";
import countryList from "country-list";

class CheckOut extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      same: false,
      shipping: {
        name: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        postal: "",
        country: "United States"
      },
      billing: {
        name: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        postal: "",
        country: "United States"
      }
    };
    this.submit = this.submit.bind(this);
    this.setSameAddress = this.setSameAddress.bind(this);
    this.handleBillName = this.handleBillName.bind(this);
    this.handleBillAddress1 = this.handleBillAddress1.bind(this);
    this.handleBillAddress2 = this.handleBillAddress2.bind(this);
    this.handleBillCity = this.handleBillCity.bind(this);
    this.handleBillCountry = this.handleBillCountry.bind(this);
    this.handleBillPostal = this.handleBillPostal.bind(this);
    this.handleBillState = this.handleBillState.bind(this);
    this.handleShipName = this.handleShipName.bind(this);
    this.handleShipAddress1 = this.handleShipAddress1.bind(this);
    this.handleShipAddress2 = this.handleShipAddress2.bind(this);
    this.handleShipCity = this.handleShipCity.bind(this);
    this.handleShipCountry = this.handleShipCountry.bind(this);
    this.handleShipPostal = this.handleShipPostal.bind(this);
    this.handleShipState = this.handleShipState.bind(this);
    this.validateBilling = this.validateBilling.bind(this);
    this.validateShipping = this.validateShipping.bind(this);
  }

  setSameAddress(event) {
    const {
      target: { checked }
    } = event;
    const billing = document.getElementById("billing");
    if (checked) {
      billing.classList.toggle("d-none");
      this.setState(state => ({
        same: !state.same
      }));
    } else {
      billing.classList.toggle("d-none");
    }
  }

  validateShipping() {
    const {
      shipping: { name, address1, postal, country }
    } = this.state;
    if (name.length === 0) return false;
    if (address1.length === 0) return false;
    if (postal.length === 0) return false;
    if (countryList.getCode(country) === undefined) return false;
    return true;
  }

  validateBilling() {
    const {
      billing: { name, address1, postal, country }
    } = this.state;
    if (name.length === 0) return false;
    if (address1.length === 0) return false;
    if (postal.length === 0) return false;
    if (countryList.getCode(country) === undefined) return false;
    return true;
  }

  async submit(event) {
    const { stripe, amount, cart, showError, clearCart, complete } = this.props;
    const { same } = this.state;
    let address = "billing";
    if (same) address = "shipping";
    const {
      [address]: {
        name,
        address1: address_line1,
        address2: address_line2,
        city: address_city,
        state: address_state,
        postal: address_zip,
        country: address_country
      },
      shipping
    } = this.state;
    if ((!same && !this.validateBilling()) || !this.validateShipping()) {
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
  }

  handleShipName(event) {
    const {
      target: { value }
    } = event;
    this.setState(state => ({
      shipping: Object.assign({}, state.shipping, {
        name: value
      })
    }));
  }

  handleShipAddress1(event) {
    const {
      target: { value }
    } = event;
    this.setState(state => ({
      shipping: Object.assign({}, state.shipping, {
        address1: value
      })
    }));
  }

  handleShipAddress2(event) {
    const {
      target: { value }
    } = event;
    this.setState(state => ({
      shipping: Object.assign({}, state.shipping, {
        address2: value
      })
    }));
  }

  handleShipCity(event) {
    const {
      target: { value }
    } = event;
    this.setState(state => ({
      shipping: Object.assign({}, state.shipping, {
        city: value
      })
    }));
  }

  handleShipState(event) {
    const {
      target: { value }
    } = event;
    this.setState(state => ({
      shipping: Object.assign({}, state.shipping, {
        state: value
      })
    }));
  }

  handleShipPostal(event) {
    const {
      target: { value }
    } = event;
    this.setState(state => ({
      shipping: Object.assign({}, state.shipping, {
        postal: value
      })
    }));
  }

  handleShipCountry(event) {
    const {
      target: { value }
    } = event;
    this.setState(state => ({
      shipping: Object.assign({}, state.shipping, {
        country: value
      })
    }));
  }

  handleBillName(event) {
    const {
      target: { value }
    } = event;
    this.setState(state => ({
      billing: Object.assign({}, state.billing, {
        name: value
      })
    }));
  }

  handleBillAddress1(event) {
    const {
      target: { value }
    } = event;
    this.setState(state => ({
      billing: Object.assign({}, state.billing, {
        address1: value
      })
    }));
  }

  handleBillAddress2(event) {
    const {
      target: { value }
    } = event;
    this.setState(state => ({
      billing: Object.assign({}, state.billing, {
        address2: value
      })
    }));
  }

  handleBillCity(event) {
    const {
      target: { value }
    } = event;
    this.setState(state => ({
      billing: Object.assign({}, state.billing, {
        city: value
      })
    }));
  }

  handleBillState(event) {
    const {
      target: { value }
    } = event;
    this.setState(state => ({
      billing: Object.assign({}, state.billing, {
        state: value
      })
    }));
  }

  handleBillPostal(event) {
    const {
      target: { value }
    } = event;
    this.setState(state => ({
      billing: Object.assign({}, state.billing, {
        postal: value
      })
    }));
  }

  handleBillCountry(event) {
    const {
      target: { value }
    } = event;
    this.setState(state => ({
      billing: Object.assign({}, state.billing, {
        country: value
      })
    }));
  }

  render() {
    const { amount } = this.props;
    const { shipping, billing } = this.state;
    const countries = countryList.getNames();
    return (
      <>
        <div className="row justify-content-center">
          <div className="checkout card w-50">
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
                  id="name"
                  value={shipping.name}
                  onChange={this.handleShipName}
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
                  id="address1"
                  value={shipping.address1}
                  onChange={this.handleShipAddress1}
                />
              </label>
              <label htmlFor="address2" className="w-100">
                <span>Address Line 2</span>
                <br />
                <input
                  type="text"
                  className="form-control"
                  id="address2"
                  value={shipping.address2}
                  onChange={this.handleShipAddress2}
                />
              </label>
              <label htmlFor="city" className="w-100">
                <span>City</span>
                <br />
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  value={shipping.city}
                  onChange={this.handleShipCity}
                />
              </label>
              <label htmlFor="state" className="w-100">
                <span>State / Province</span>
                <br />
                <input
                  type="text"
                  className="form-control"
                  id="state"
                  value={shipping.state}
                  onChange={this.handleShipState}
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
                  id="postal"
                  value={shipping.postal}
                  onChange={this.handleShipPostal}
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
                  id="country"
                  value={shipping.country}
                  onChange={this.handleShipCountry}
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
          <div className="checkout card w-50">
            <div className="card-header">Billing Info</div>
            <div className="card-body d-flex flex-column align-items-center">
              <div className="form-check input-group mb-3">
                <label className="form-check-label" htmlFor="same_address">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="same_address"
                    onChange={this.setSameAddress}
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
                    id="bill_name"
                    value={billing.name}
                    onChange={this.handleBillName}
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
                    id="bill_address1"
                    value={billing.address1}
                    onChange={this.handleBillAddress1}
                  />
                </label>
                <label htmlFor="bill_address2" className="w-100">
                  <span>Address Line 2</span>
                  <br />
                  <input
                    type="text"
                    className="form-control"
                    id="bill_address2"
                    value={billing.address2}
                    onChange={this.handleBillAddress2}
                  />
                </label>
                <label htmlFor="bill_city" className="w-100">
                  <span>City</span>
                  <br />
                  <input
                    type="text"
                    className="form-control"
                    id="bill_city"
                    value={billing.city}
                    onChange={this.handleBillCity}
                  />
                </label>
                <label htmlFor="bill_state" className="w-100">
                  <span>State / Province</span>
                  <br />
                  <input
                    type="text"
                    className="form-control"
                    id="bill_state"
                    value={billing.state}
                    onChange={this.handleBillState}
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
                    id="bill_postal"
                    value={billing.postal}
                    onChange={this.handleBillPostal}
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
                    id="bill_country"
                    value={shipping.country}
                    onChange={this.handleShipCountry}
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
          <div className="checkout card w-50">
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
                onClick={this.submit}
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
  }
}

CheckOut.propTypes = {
  amount: PropTypes.string.isRequired,
  cart: PropTypes.arrayOf(PropTypes.string).isRequired,
  showError: PropTypes.func.isRequired,
  clearCart: PropTypes.func.isRequired,
  complete: PropTypes.func.isRequired
};

export default injectStripe(CheckOut);
