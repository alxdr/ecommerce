import React from "react";
import PropTypes from "prop-types";
import NavLink from "./navlink";

const AuthButtons = React.memo(props => {
  const { loggedIn, logout, connected } = props;
  let result = null;
  if (loggedIn) {
    const connect = connected ? (
      <NavLink href="/sell">
        <span className="fas fa-hand-holding-usd"> Sell</span>
      </NavLink>
    ) : (
      <NavLink href="/connect">
        <span className="fas fa-hand-holding-usd"> Start Selling</span>
      </NavLink>
    );
    result = (
      <>
        {connect}
        <NavLink href="/profile">
          <span className="fas fa-user"> Profile</span>
        </NavLink>
        <NavLink href="/" onClick={logout}>
          <span className="fas fa-sign-out-alt"> Logout</span>
        </NavLink>
      </>
    );
  } else {
    result = (
      <>
        <NavLink href="/login">
          <span className="fas fa-sign-in-alt"> Login</span>
        </NavLink>
        <NavLink href="/register">
          <span className="fas fa-user-plus"> Register</span>
        </NavLink>
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
