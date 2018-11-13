import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import TransacTable from "./transactable";
import Transaction from "./transaction";

class Profile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      transactions: { buys: [], sells: [] }
    };
  }

  componentDidMount() {
    const { showError } = this.props;
    axios
      .get("/profile")
      .then(res =>
        this.setState({
          transactions: res.data
        })
      )
      .catch(error => {
        if (error.response) {
          if (error.response.status === 401) {
            showError(Error("Sorry, you have to log in first."));
          } else {
            showError(error.response);
          }
        } else if (error.request) {
          showError(error.request);
        } else {
          showError(error);
        }
      });
  }

  render() {
    const {
      transactions: { buys, sells }
    } = this.state;
    const { details } = this.props;
    if (details !== null) return <Transaction details={details} />;
    return (
      <>
        {buys.length > 0 ? (
          <TransacTable data={buys} title="Purchases" />
        ) : null}
        {sells.length > 0 ? <TransacTable data={sells} title="Sales" /> : null}
      </>
    );
  }
}

Profile.defaultProps = {
  details: null
};

Profile.propTypes = {
  showError: PropTypes.func.isRequired,
  details: PropTypes.objectOf(PropTypes.any)
};

export default Profile;
