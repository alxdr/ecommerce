import React from "react";
import PropTypes from "prop-types";
import Link from "./link";

const Item = React.memo(props => {
  const {
    data: { productName, department, text, price, imageSrc, _id: id },
    render,
    data
  } = props;
  return (
    <div className="card d-flex flex-row justify-content-around align-items-center my-2">
      <img className="w-25 h-100" src={imageSrc} alt={productName} />
      <div className="card-body w-75">
        <h5 className="card-title">{productName}</h5>
        <h6 className="card-subtitle mb-2">{department}</h6>
        <h6 className="card-subtitle mb-2 text-muted">{`$${price}`}</h6>
        {text.length > 0 ? <p className="card-text">{text}</p> : null}
        <Link
          href={`/product?query=${id}`}
          data={{ product: data }}
          className="btn btn-info mr-2"
          role="button"
        >
          <span className="fas fa-eye text-white"> View</span>
        </Link>
        {render(id)}
      </div>
    </div>
  );
});

Item.propTypes = {
  data: PropTypes.shape({
    productName: PropTypes.string,
    department: PropTypes.string,
    text: PropTypes.string,
    price: PropTypes.string,
    createdDate: PropTypes.string,
    updatedDate: PropTypes.string,
    sellerId: PropTypes.string
  }).isRequired,
  render: PropTypes.func.isRequired
};

export default Item;
