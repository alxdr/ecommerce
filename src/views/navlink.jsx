import React from "react";
import Link from "./link";

const NavLink = React.memo(props => (
  <li className="nav-item">
    <Link className="nav-link" {...props}>
      {props.children}
    </Link>
  </li>
));

export default NavLink;
