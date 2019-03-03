import React, { useCallback } from "react";
import PropTypes from "prop-types";
import List from "./list";
import AddToCartButton from "./addtocart_button";

const Search = React.memo(props => {
  const { addToCart, data } = props;
  const searchRenderProp = useCallback(
    id => <AddToCartButton addToCart={addToCart} id={id} />,
    [addToCart]
  );
  return <List data={data} render={searchRenderProp} />;
});

Search.defaultProps = {
  data: null
};

Search.propTypes = {
  addToCart: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))
};

export default Search;
