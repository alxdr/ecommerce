import React from "react";
import PropTypes from "prop-types";
import AuthButtons from "./auth_buttons";
import SearchBar from "./search_bar";
import Link from "./link";

const NavBar = React.memo(props => {
  const { loggedIn, logout, showSearch, showError, connected, counter } = props;

  return (
    <nav className="nav navbar navbar-expand-lg navbar-light bg-light fixed-top mb-3 nav-fill">
      <Link href="/" className="navbar-brand nav-item d-none d-sm-block">
        SimpleCommerce
      </Link>
      <SearchBar showSearch={showSearch} showError={showError} />
      <button
        className="navbar-toggler py-2 px-3"
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
        <Link href="/" className="navbar-brand nav-item d-block d-sm-none">
          SimpleCommerce
        </Link>
        <Link href="/cart" className="nav-item nav-link text-dark">
          <span className="fas fa-shopping-cart">
            {" Cart"}
            {counter > 0 ? <span id="badge">{counter}</span> : null}
          </span>
        </Link>
        <AuthButtons
          loggedIn={loggedIn}
          logout={logout}
          connected={connected}
        />
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
