import React from "react";
import axios from "axios";
import PropTypes from "prop-types";

class SearchBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      query: ""
    };
    this.search = this.search.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  search(event) {
    event.preventDefault();
    event.stopPropagation();
    const { query } = this.state;
    const { showSearch, showError } = this.props;
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
  }

  handleChange(event) {
    this.setState({
      query: event.target.value
    });
  }

  render() {
    const { query } = this.state;
    return (
      <form
        className="form-inline"
        method="get"
        action="/search"
        onSubmit={this.search}
      >
        <div className="input-group">
          <input
            className="form-control"
            type="search"
            placeholder="Search"
            aria-label="Search"
            name="search"
            value={query}
            onChange={this.handleChange}
          />
          <div className="input-group-append">
            <button className="btn btn-success" type="submit">
              <span className="fas fa-search" />
            </button>
          </div>
        </div>
      </form>
    );
  }
}

SearchBar.propTypes = {
  showSearch: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired
};

export default SearchBar;
