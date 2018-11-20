import React from "react";
import PropTypes from "prop-types";

const Transaction = React.memo(props => {
  const {
    transaction: {
      seller: { email: sellerEmail },
      buyer: { email: buyerEmail },
      product: { productName },
      amount,
      shipping: { name, address1, address2, city, state, postal, country },
      createdDate: date
    }
  } = props;
  const shippingAddress = (
    <p className="text-muted">
      {name}
      <br />
      {address1}
      <br />
      {address2}
      <br />
      {city}
      <br />
      {state}
      <br />
      {postal}
      <br />
      {country}
    </p>
  );
  return (
    <div className="row justify-content-center">
      <div className="card d-inline-flex flex-column mt-2">
        <div className="card-header">Transaction Details</div>
        <div className="card-body">
          <h5 className="card-title">{`Product: ${productName}`}</h5>
          <h6 className="card-subtitle mb-2">{`Transaction Amount: $${amount}`}</h6>
          <h6 className="card-subtitle mb-2">{`Buyer's Email: ${buyerEmail}`}</h6>
          <h6 className="card-subtitle mb-2">{`Seller's Email: ${sellerEmail}`}</h6>
          <h6 className="card-subtitle mb-2">
            {`Transaction Date: ${new Date(date).toLocaleString()}`}
          </h6>
          <h6 className="card-subtitle mb-2">Shipping Address:</h6>
          {shippingAddress}
        </div>
      </div>
    </div>
  );
});

Transaction.propTypes = {
  transaction: PropTypes.objectOf(PropTypes.any).isRequired
};

export default Transaction;
