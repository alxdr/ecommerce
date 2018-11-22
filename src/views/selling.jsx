import React from "react";
import PropTypes from "prop-types";
import List from "./list";
import Link from "./link";

function disappear(event) {
  event.currentTarget.classList.add("d-none");
  event.currentTarget.nextElementSibling.classList.remove("d-none");
}

class Selling extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderProp = this.renderProp.bind(this);
  }

  renderProp(id, data) {
    const { deleteProduct } = this.props;
    return (
      <>
        <Link
          className="btn btn-warning mr-2"
          href={`/profile/edit/selling?id=${id}`}
          data={{ edit: data }}
        >
          <span className="fas fa-edit"> Edit</span>
        </Link>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={disappear}
        >
          <span className="fas fa-trash"> Delete</span>
        </button>
        <button
          type="button"
          className="btn btn-danger d-none"
          onClick={() => deleteProduct(id)}
        >
          <span className="fas fa-trash"> Confirm?</span>
        </button>
      </>
    );
  }

  render() {
    const { data } = this.props;
    return <List data={data} render={this.renderProp} />;
  }
}

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
