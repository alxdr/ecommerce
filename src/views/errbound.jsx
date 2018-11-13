import React from "react";
import PropTypes from "prop-types";
import Err from "./error";

class ErrorBoundary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.log(error);
    console.log(info);
  }

  render() {
    const { children } = this.props;
    const { hasError, error } = this.state;
    if (hasError) {
      return <Err error={error} />;
    }
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;
