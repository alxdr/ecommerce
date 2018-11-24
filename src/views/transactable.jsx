import React from "react";
import PropTypes from "prop-types";
import Link from "./link";

const TransacTable = React.memo(props => {
  const { data, title } = props;
  return (
    <div className="table-responsive">
      <table className="table table-borderless table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">{title}</th>
            <th scope="col">Amount</th>
            <th scope="col">{`${title} Date`}</th>
            <th scope="col">Contact</th>
            <th scope="col">Review</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, index) => {
            const { _id: id, product, amount, createdDate: date, review } = d;
            const contact =
              title === "Purchase" ? d.seller.email : d.buyer.email;
            let reviewSection = null;
            let productSection = null;
            if (product === null) {
              productSection = "This product is no longer available.";
              reviewSection = "Not Applicable";
            } else {
              const { productName, _id: pid } = product;
              productSection = (
                <Link href="/profile/transaction" data={{ transaction: d }}>
                  <span>{productName}</span>
                </Link>
              );
              if (review === null) {
                if (title === "Purchase") {
                  reviewSection = (
                    <Link
                      className="btn btn-primary"
                      href="/profile/transaction/reviewing"
                      data={{ reviewing: { tid: id, pid } }}
                    >
                      <span className="fas fa-pen"> Review</span>
                    </Link>
                  );
                } else {
                  reviewSection = "None";
                }
              } else {
                reviewSection = (
                  <Link
                    className="btn btn-secondary"
                    href="/profile/transaction/review"
                    data={{ review: { review, productName } }}
                  >
                    <span className="fas fa-eye"> Review</span>
                  </Link>
                );
              }
            }
            return (
              <tr key={id}>
                <th scope="row">{index + 1}</th>
                <td className="w-25">{productSection}</td>
                <td className="w-25">{`$${amount}`}</td>
                <td className="w-25">{new Date(date).toLocaleString()}</td>
                <td>{contact}</td>
                <td>{reviewSection}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

TransacTable.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      buyer: PropTypes.string,
      seller: PropTypes.string,
      amount: PropTypes.string,
      product: PropTypes.shape({
        productName: PropTypes.string,
        department: PropTypes.string,
        text: PropTypes.string,
        price: PropTypes.string,
        createdDate: PropTypes.string,
        updatedDate: PropTypes.string,
        sellerId: PropTypes.string
      }),
      createdDate: PropTypes.string
    })
  ).isRequired
};

export default TransacTable;
