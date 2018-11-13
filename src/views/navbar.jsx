import React from "react";
import PropTypes from "prop-types";
import AuthButtons from "./auth_buttons";
import SearchBar from "./search_bar";
import NavLink from "./navlink";

const NavBar = React.memo(props => {
  const { loggedIn, logout, showSearch, showError, connected } = props;

  return (
    <nav className="nav navbar navbar-expand-lg navbar-light bg-light fixed-top mb-3 nav-fill">
      <NavLink href="/" className="navbar-brand d-none d-sm-block">
        SimpleCommerce
      </NavLink>
      <SearchBar showSearch={showSearch} showError={showError} />
      <button
        className="navbar-toggler ml-5"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="fas fa-bars fa-4" />
      </button>
      <div
        className="collapse navbar-collapse justify-content-lg-end"
        id="navbarNav"
      >
        <ul className="navbar-nav">
          <NavLink href="/" className="navbar-brand d-block d-sm-none">
            SimpleCommerce
          </NavLink>
          <NavLink href="/cart">
            <span className="fas fa-shopping-cart"> Cart</span>
          </NavLink>
          <AuthButtons
            loggedIn={loggedIn}
            logout={logout}
            connected={connected}
          />
        </ul>
      </div>
    </nav>
  );
});

NavBar.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  connected: PropTypes.bool.isRequired,
  showSearch: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

export default NavBar;
