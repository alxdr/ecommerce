import React from "react";
import PropTypes from "prop-types";
import Item from "./item";

const List = React.memo(props => {
  const { data, render } = props;
  if (data === null) return null;
  return data.map((d, i) => {
    const { _id: id } = d;
    const key = `${id}-${i}`;
    return <Item key={key} data={d} render={render} index={i} />;
  });
});

List.defaultProp = {
  data: null
};

List.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      imageSrc: PropTypes.string,
      productName: PropTypes.string,
      department: PropTypes.string,
      text: PropTypes.string,
      price: PropTypes.string
    })
  ),
  render: PropTypes.func.isRequired
};

export default List;
