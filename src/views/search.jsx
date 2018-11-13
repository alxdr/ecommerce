import React from "react";
import PropTypes from "prop-types";
import List from "./list";
import AddToCartButton from "./addtocart_button";

class Search extends React.PureComponent {
  constructor(props) {
    super(props);
    this.searchRenderProp = this.searchRenderProp.bind(this);
  }

  searchRenderProp(id) {
    const { addToCart } = this.props;
    return <AddToCartButton addToCart={addToCart} id={id} />;
  }

  render() {
    const { data } = this.props;
    return <List data={data} render={this.searchRenderProp} />;
  }
}

Search.defaultProps = {
  data: null
};

Search.propTypes = {
  addToCart: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))
};

export default Search;
