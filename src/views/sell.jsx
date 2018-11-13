import React from "react";
import axios from "axios";
import PropTypes from "prop-types";

function validateForm(formData) {
  const file = formData.get("image");
  const productName = formData.get("productName");
  const department = formData.get("department");
  const price = formData.get("price");
  if (file.size === 0) return false;
  if (productName.length === 0) return false;
  if (department.length === 0) return false;
  if (price.length === 0) return false;
  return true;
}

class Sell extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      complete: false,
      imageLabel: "Choose file for product image"
    };
    this.submit = this.submit.bind(this);
    this.handleImage = this.handleImage.bind(this);
  }

  submit(event) {
    const { showError } = this.props;
    event.preventDefault();
    event.stopPropagation();
    const form = document.querySelector("#form");
    const formData = new FormData(form);
    if (!validateForm(formData)) {
      document.querySelector("#warning").classList.remove("d-none");
      return;
    }
    const token = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    axios
      .post("/sell", formData, {
        xsrfHeaderName: "csrf-token",
        headers: {
          "Content-Type": "multipart/form-data",
          "csrf-token": token
        }
      })
      .then(() => {
        this.setState({ complete: true });
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

  handleImage(event) {
    const { target } = event;
    this.setState({ imageLabel: target.files[0].name });
  }

  render() {
    const { complete, imageLabel } = this.state;
    if (complete) {
      return (
        <div className="alert alert-success" role="alert">
          <strong>Success!</strong>
        </div>
      );
    }
    return (
      <div className="row justify-content-center">
        <form action="/sell" method="post" id="form" className="w-50">
          <div className="form-group">
            <label htmlFor="productName" className="w-100 d-flex flex-column">
              <span>
                Product Name
                <sup>*</sup>
              </span>
              <input type="text" name="productName" id="productName" required />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="department" className="w-100 d-flex flex-column">
              <span>
                Department
                <sup>*</sup>
              </span>
              <input type="text" name="department" id="department" required />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="price" className="w-100 d-flex flex-column">
              <span>
                Price
                <sup>*</sup>
              </span>
              <input
                type="number"
                step="0.01"
                min="0.50"
                id="price"
                name="price"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="text" className="w-100 d-flex flex-column">
              <span>Additional Text: </span>
              <textarea className="form-control" id="text" name="text" />
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
                  onChange={this.handleImage}
                  accept="image/png, image/jpeg"
                  required
                />
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            onClick={this.submit}
          >
            Submit
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
  }
}

Sell.propTypes = {
  showError: PropTypes.func.isRequired
};

export default Sell;
