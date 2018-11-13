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
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
          integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.4.1/css/all.css"
          integrity="sha384-5sAR7xN1Nv6T6+dT2mhtzEpVJvfS3NScPQTrOxhwjIuvcA67KV2R5Jz6kr4abQsz"
          crossOrigin="anonymous"
        />
        {style ? <link rel="stylesheet" href={style} /> : null}
        <title>App</title>
      </head>
      <body>
        <div id="root">{children}</div>
        <script
          src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
          integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
          crossOrigin="anonymous"
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"
          integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
          crossOrigin="anonymous"
        />
        <script
          src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"
          integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy"
          crossOrigin="anonymous"
        />
        <script
          crossOrigin="anonymous"
          src={`https://unpkg.com/react@16/umd/react.${mode}.js`}
        />
        <script
          crossOrigin="anonymous"
          src={`https://unpkg.com/react-dom@16/umd/react-dom.${mode}.js`}
        />
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
