import React, { useCallback } from "react";
import PropTypes from "prop-types";
import List from "./list";
import Link from "./link";

function disappear(event) {
  event.currentTarget.classList.add("d-none");
  event.currentTarget.nextElementSibling.classList.remove("d-none");
}

const Selling = React.memo(props => {
  const { deleteProduct, data: listData } = props;
  const renderProp = useCallback(
    (id, data) => (
      <>
        <Link
          className="btn btn-warning mr-2 mb-2"
          href={`/profile/edit/selling?id=${id}`}
          data={{ edit: data }}
        >
          <span className="fas fa-edit"> Edit</span>
        </Link>
        <button
          type="button"
          className="btn btn-outline-danger mb-2"
          onClick={disappear}
        >
          <span className="fas fa-trash"> Delete</span>
        </button>
        <button
          type="button"
          className="btn btn-danger d-none mb-2"
          onClick={() => deleteProduct(id)}
        >
          <span className="fas fa-trash"> Confirm?</span>
        </button>
      </>
    ),
    [deleteProduct]
  );

  return <List data={listData} render={renderProp} />;
});

Selling.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      imageSrc: PropTypes.string,
      productName: PropTypes.string,
      department: PropTypes.string,
      text: PropTypes.string,
      price: PropTypes.string
    })
  ).isRequired,
  deleteProduct: PropTypes.func.isRequired
};

export default Selling;
