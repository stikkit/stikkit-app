import React from "react";
import "./Spinner.css";

const Spinner: React.FunctionComponent = () => (
  <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
);

export default Spinner;
