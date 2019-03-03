import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import TransacTable from "./transactable";
import Selling from "./selling";
import Settings from "./settings";

const Profile = React.memo(props => {
  const { showError } = props;
  const [buys, setBuys] = useState([]);
  const [sells, setSells] = useState([]);
  const [selling, setSelling] = useState([]);

  useEffect(() => {
    axios
      .get("/profile")
      .then(res => {
        const {
          buys: nextBuys,
          sells: nextSells,
          selling: nextSelling
        } = res.data;
        setBuys(nextBuys);
        setSells(nextSells);
        setSelling(nextSelling);
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
  }, []);

  const deleteProduct = useCallback(
    id => {
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
          setSelling(prevSelling => {
            const nextSelling = prevSelling.slice();
            const index = nextSelling.findIndex(product => {
              const { _id: pid } = product;
              return pid === id;
            });
            if (index === -1) return {};
            nextSelling.splice(index, 1);
            return nextSelling;
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
    },
    [showError]
  );

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
          <Selling data={selling} deleteProduct={deleteProduct} />
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
});

Profile.propTypes = {
  showError: PropTypes.func.isRequired
};

export default Profile;
