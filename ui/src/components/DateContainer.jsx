import React, { useState, useEffect } from "react";
import UIDatePicker from "./DatePicker";

const DateContainer = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onSearch = null,
}) => {
  const [error, setError] = useState(false);

  // error checking for dates
  useEffect(() => {
    const nowTime = new Date();
    if (startDate > endDate) {
      setError(true);
    } else if (endDate > nowTime) {
      setError(true);
    } else {
      setError(false);
    }
  }, [startDate, endDate]);

  // css
  const containerClass = error ? "date-container incorrect" : "date-container";

  // onclick trigger
  const onClick = () => {
    if (error) return null;
    else onSearch();
  };

  return (
    <div className={containerClass}>
      <div className="calendar-icon">
        <i className="fas fa-calendar-alt"></i>
      </div>
      <UIDatePicker date={startDate} setDate={setStartDate} />
      <div className="arrow-icon">
        <i className="fas fa-arrow-right"></i>
      </div>
      <UIDatePicker date={endDate} setDate={setEndDate} />
      <button className="btn-update" onClick={onClick}>
        Search
      </button>
    </div>
  );
};

export default DateContainer;
