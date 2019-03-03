import React, { useState, useReducer } from "react";
import axios from "axios";
import PropTypes from "prop-types";

function validateForm(formData, edit) {
  const file = formData.get("image");
  const productName = formData.get("productName");
  const department = formData.get("department");
  const price = formData.get("price");
  if (!edit && file.size === 0) return false;
  if (productName.length === 0) return false;
  if (department.length === 0) return false;
  if (price.length === 0) return false;
  return true;
}

function reducer(state, action) {
  switch (action.type) {
    case "productName":
      return { ...state, productName: action.data };
    case "department":
      return { ...state, department: action.data };
    case "text":
      return { ...state, text: action.data };
    case "price":
      return { ...state, price: action.data };
    default:
      throw new Error("No such field!");
  }
}

const Sell = React.memo(props => {
  const {
    preset,
    preset: { _id: id },
    showError,
    edit
  } = props;
  const [isComplete, setIsComplete] = useState(false);
  const [imageLabel, setImageLabel] = useState("Choose image");
  const [state, dispatch] = useReducer(reducer, preset);
  const { productName, department, text, price } = state;

  const handleSubmit = event => {
    event.preventDefault();
    event.stopPropagation();
    const form = document.querySelector("#form");
    const formData = new FormData(form);
    if (!validateForm(formData, edit)) {
      document.querySelector("#warning").classList.remove("d-none");
      return;
    }
    event.currentTarget.setAttribute("disabled", true);
    const spinner = document.querySelector("#spinner");
    spinner.classList.remove("d-none");
    const token = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    let promise = null;
    if (edit) {
      promise = axios.patch(`/edit/product/${id}`, formData, {
        xsrfHeaderName: "csrf-token",
        headers: {
          "Content-Type": "multipart/form-data",
          "csrf-token": token
        }
      });
    } else {
      promise = axios.post("/sell", formData, {
        xsrfHeaderName: "csrf-token",
        headers: {
          "Content-Type": "multipart/form-data",
          "csrf-token": token
        }
      });
    }
    promise
      .then(() => setIsComplete(true))
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

  const handleImage = event => setImageLabel(event.target.files[0].name);
  const handleChange = event =>
    dispatch({ type: event.target.name, data: event.target.value });

  if (isComplete) {
    return (
      <div className="alert alert-success text-center" role="alert">
        <span className="fas fa-check-circle">
          <strong> Success</strong>
        </span>
      </div>
    );
  }
  return (
    <div className="row justify-content-center">
      <form action="/sell" method="post" id="form" className="customForm">
        <div className="form-group">
          <label htmlFor="productName" className="w-100 d-flex flex-column">
            <span>
              Product Name
              <sup>*</sup>
            </span>
            <input
              className="form-control"
              type="text"
              name="productName"
              id="productName"
              value={productName}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="department" className="w-100 d-flex flex-column">
            <span>
              Department
              <sup>*</sup>
            </span>
            <input
              className="form-control"
              type="text"
              name="department"
              id="department"
              value={department}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="price" className="w-100 d-flex flex-column">
            <span>
              Price
              <sup>*</sup>
            </span>
            <input
              className="form-control"
              type="number"
              step="0.01"
              min="0.50"
              id="price"
              name="price"
              value={price}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="text" className="w-100 d-flex flex-column">
            <span>Additional Text: </span>
            <textarea
              className="form-control"
              id="text"
              name="text"
              value={text}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-group">
          <div className="custom-file">
            <label className="custom-file-label" htmlFor="image">
              <span id="imageLabel">
                {imageLabel}
                <sup>*</sup>
              </span>
              <input
                type="file"
                className="custom-file-input"
                id="image"
                name="image"
                onChange={handleImage}
                accept="image/png, image/jpeg"
                required
              />
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-block"
          onClick={handleSubmit}
        >
          <span className="fas fa-spinner fa-pulse d-none" id="spinner" />
          <span> Submit</span>
        </button>
        <div
          className="alert alert-danger text-center d-none mt-2 "
          role="alert"
          id="warning"
        >
          {"Please complete all "}
          <strong>
            required
            <sup>*</sup>
          </strong>
          {" fields."}
        </div>
      </form>
    </div>
  );
});

Sell.defaultProps = {
  preset: {
    productName: "",
    department: "",
    text: "",
    price: ""
  },
  edit: false
};

Sell.propTypes = {
  showError: PropTypes.func.isRequired,
  preset: PropTypes.objectOf(PropTypes.string),
  edit: PropTypes.bool
};

export default Sell;
