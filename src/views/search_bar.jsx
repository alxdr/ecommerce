import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const SearchBar = React.memo(props => {
  const { showError, showSearch } = props;
  const [query, setQuery] = useState("");

  const search = event => {
    event.preventDefault();
    event.stopPropagation();
    axios
      .get(`/search?query=${query}`)
      .then(response => {
        showSearch(response.data);
      })
      .catch(error => {
        if (error.response) {
          showError(error.response);
        } else if (error.request) {
          showError(error.request);
        } else {
          showError(error);
        }
      });
  };

  const handleChange = event => setQuery(event.target.value);

  return (
    <form
      className="form-inline"
      method="get"
      action="/search"
      onSubmit={search}
    >
      <div className="input-group">
        <input
          className="form-control"
          type="search"
          placeholder="Search"
          aria-label="Search"
          name="search"
          value={query}
          onChange={handleChange}
        />
        <div className="input-group-append">
          <button className="btn btn-success" type="submit">
            <span className="fas fa-search" />
          </button>
        </div>
      </div>
    </form>
  );
});

SearchBar.propTypes = {
  showSearch: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired
};

export default SearchBar;
