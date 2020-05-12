import React from "react";

const Metric = ({ title, value, extra = null }) => {
  return (
    <div className="metric">
      <div className="main">
        <div className="value">{value}</div>
        <div className="title">{title}</div>
      </div>
      {extra}
    </div>
  );
};

export default Metric;
