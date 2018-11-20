import React from "react";
import Sell from "./sell";

const Edit = React.memo(props => {
  const { edit, showError } = props;
  return <Sell preset={edit} showError={showError} edit />;
});

export default Edit;
