import React from "react";
import PropTypes from "prop-types";
import Link from "./link";

const AuthButtons = React.memo(props => {
  const { loggedIn, logout, connected } = props;
  let result = null;
  if (loggedIn) {
    const connect = connected ? (
      <Link href="/sell" className="nav-item nav-link">
        <span className="fas fa-dollar-sign"> Sell</span>
      </Link>
    ) : (
      <Link href="/connect" className="nav-item nav-link">
        <span className="fab fa-stripe-s"> Start Selling</span>
      </Link>
    );
    result = (
      <>
        {connect}
        <Link href="/profile" className="nav-item nav-link">
          <span className="fas fa-user"> Profile</span>
        </Link>
        <Link href="/" onClick={logout} className="nav-item nav-link">
          <span className="fas fa-sign-out-alt"> Logout</span>
        </Link>
      </>
    );
  } else {
    result = (
      <>
        <Link href="/login" className="nav-item nav-link">
          <span className="fas fa-sign-in-alt"> Login</span>
        </Link>
        <Link href="/register" className="nav-item nav-link">
          <span className="fas fa-user-plus"> Register</span>
        </Link>
      </>
    );
  }
  return result;
});

AuthButtons.propTypes = {
  connected: PropTypes.bool.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired
};

export default AuthButtons;
