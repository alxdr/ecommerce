import React from "react";
import PropTypes from "prop-types";
import Link from "./link";

const Item = React.memo(props => {
  const {
    data: { productName, department, text, price, imageSrc, _id: id },
    render,
    data,
    index
  } = props;
  return (
    <div className="card d-flex flex-md-row flex-sm-column justify-content-around align-items-center my-2">
      <img className="img-fluid maxWidth" src={imageSrc} alt={productName} />
      <div className="card-body">
        <h5 className="card-title">{productName}</h5>
        <h6 className="card-subtitle mb-2">{department}</h6>
        <h6 className="card-subtitle mb-2 text-muted">{`$${price}`}</h6>
        {text.length > 0 ? <p className="card-text">{text}</p> : null}
        <Link
          href={`/product?id=${id}`}
          data={{ product: data }}
          className="btn btn-info mr-2 mb-2"
          role="button"
        >
          <span className="fas fa-eye text-white"> View</span>
        </Link>
        {render(id, data, index)}
      </div>
    </div>
  );
});

Item.propTypes = {
  data: PropTypes.shape({
    imageSrc: PropTypes.string,
    productName: PropTypes.string,
    department: PropTypes.string,
    text: PropTypes.string,
    price: PropTypes.string
  }).isRequired,
  render: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
};

export default Item;
