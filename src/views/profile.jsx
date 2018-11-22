import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import TransacTable from "./transactable";
import Selling from "./selling";
import Settings from "./settings";

class Profile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      buys: [],
      sells: [],
      selling: []
    };
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  componentWillMount() {
    const { showError } = this.props;
    axios
      .get("/profile")
      .then(res => {
        const { buys, sells, selling } = res.data;
        this.setState({
          buys,
          sells,
          selling
        });
      })
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

  deleteProduct(id) {
    const { showError } = this.props;
    const token = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    axios
      .delete(`/delete/product/${id}`, {
        xsrfHeaderName: "csrf-token",
        headers: {
          "csrf-token": token
        }
      })
      .then(() => {
        this.setState(state => {
          const selling = state.selling.slice();
          const index = selling.findIndex(product => {
            const { _id: pid } = product;
            return pid === id;
          });
          if (index === -1) return {};
          selling.splice(index, 1);
          return { selling };
        });
      })
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

  render() {
    const { buys, sells, selling } = this.state;
    const { showError } = this.props;
    return (
      <>
        <ul className="nav nav-tabs" id="tablist" role="tablist">
          <li className="nav-item">
            <a
              className="nav-link active"
              id="purchase-tab"
              data-toggle="tab"
              href="#purchases"
              role="tab"
              aria-controls="purchases"
              aria-selected="true"
            >
              Purchases
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="sales-tab"
              data-toggle="tab"
              href="#sales"
              role="tab"
              aria-controls="sales"
              aria-selected="false"
            >
              Sales
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="selling-tab"
              data-toggle="tab"
              href="#selling"
              role="tab"
              aria-controls="selling"
              aria-selected="false"
            >
              Selling
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="settings-tab"
              data-toggle="tab"
              href="#settings"
              role="tab"
              aria-controls="settings"
              aria-selected="false"
            >
              Settings
            </a>
          </li>
        </ul>
        <div className="tab-content" id="tabContent">
          <div
            className="tab-pane fade show active"
            id="purchases"
            role="tabpanel"
            aria-labelledby="purchases-tab"
          >
            <TransacTable data={buys} title="Purchase" />
          </div>
          <div
            className="tab-pane fade"
            id="sales"
            role="tabpanel"
            aria-labelledby="sales-tab"
          >
            <TransacTable data={sells} title="Sales" />
          </div>
          <div
            className="tab-pane fade"
            id="selling"
            role="tabpanel"
            aria-labelledby="selling-tab"
          >
            <Selling data={selling} deleteProduct={this.deleteProduct} />
          </div>
          <div
            className="tab-pane fade"
            id="settings"
            role="tabpanel"
            aria-labelledby="settings-tab"
          >
            <Settings showError={showError} />
          </div>
        </div>
      </>
    );
  }
}

Profile.propTypes = {
  showError: PropTypes.func.isRequired
};

export default Profile;
