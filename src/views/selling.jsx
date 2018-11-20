import React from "react";
import List from "./list";
import Link from "./link";

function renderProp(id, data) {
  return (
    <Link
      className="btn btn-warning"
      href={`/profile/edit/selling?id=${id}`}
      data={{ edit: data }}
    >
      <span className="fas fa-edit"> Edit</span>
    </Link>
  );
}

const Selling = React.memo(props => (
  <List data={props.data} render={renderProp} />
));

export default Selling;
