import React from "react";
import PropTypes from "prop-types";
import history from "../helpers/history";

const Link = React.memo(props => {
  const { href, data, onClick, children, ...others } = props;
  const trigger = event => {
    const externalLink = href.startsWith("http");
    const newTab = event.metaKey || event.ctrlKey;

    if (!externalLink && !newTab) {
      event.preventDefault();
      if (data !== null) {
        history.push(href, data);
      } else {
        history.push(href);
      }
    }
    if (onClick !== null) onClick();
  };
  return (
    <a href={href} onClick={trigger} {...others}>
      {children}
    </a>
  );
});

Link.defaultProps = {
  data: null,
  onClick: null
};

Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default Link;
