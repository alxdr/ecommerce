import React from "react";
import PropTypes from "prop-types";

const Html = React.memo(props => {
  const { children, style, script, token } = props;
  const mode =
    process.env.NODE_ENV === "production" ? "production.min" : "development";
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="csrf-token" content={token} />
        <link rel="stylesheet" href="/local/bootstrap.min.css" />
        <link
          rel="stylesheet"
          href="/local/fontawesome-5.4.1/css/all.min.css"
        />
        {style ? <link rel="stylesheet" href={style} /> : null}
        <title>App</title>
      </head>
      <body>
        <div id="root">{children}</div>
        <script src="/local/jquery.slim.min.js" />
        <script src="/local/popper.min.js" />
        <script src="/local/bootstrap.min.js" />
        <script src={`/local/react.${mode}.js`} />
        <script src={`/local/react-dom.${mode}.js`} />
        <script src="https://js.stripe.com/v3/" />
        {script ? <script src={script} /> : null}
      </body>
    </html>
  );
});

Html.defaultProps = {
  style: "",
  script: ""
};

Html.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.string,
  script: PropTypes.string,
  token: PropTypes.string.isRequired
};

export default Html;
