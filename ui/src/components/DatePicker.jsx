import React from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const UIDatePicker = ({ date = new Date(), setDate }) => {
  return (
    <DatePicker
      selected={date}
      onChange={(date) => setDate(date)}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={10}
      dateFormat="MMM d, yyyy @ kk:mm"
    />
  );
};

export default UIDatePicker;
