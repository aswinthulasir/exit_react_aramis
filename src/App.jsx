import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

function App() {
  const [checkInOutTimes, setCheckInOutTimes] = useState([]); 
  const [currentCheckIn, setCurrentCheckIn] = useState(null);
  const [overtime, setOvertime] = useState(0); 
  const [finalExitTime, setFinalExitTime] = useState(null);

 
  const handleCheckIn = () => {
    if (!currentCheckIn) {
      setCurrentCheckIn(dayjs());
      return;
    }
   
    const updatedTimes = [...checkInOutTimes, { checkIn: currentCheckIn, checkOut: dayjs() }];
    setCheckInOutTimes(updatedTimes);
    setCurrentCheckIn(null);
  };

 
  const handleOvertimeChange = (event) => {
    const minutes = parseInt(event.target.value, 10);
    setOvertime(minutes > 60 ? 60 : minutes); // Limit max overtime to 60 minutes
  };

 
  const calculateExitTime = () => {
    let totalOfficeMinutes = 0;
    let firstCheckIn = null;

    checkInOutTimes.forEach(({ checkIn, checkOut }) => {
      if (!firstCheckIn) firstCheckIn = checkIn;
      totalOfficeMinutes += checkOut.diff(checkIn, "minute");
    });

    if (currentCheckIn) {
      if (!firstCheckIn) firstCheckIn = currentCheckIn;
      totalOfficeMinutes += dayjs().diff(currentCheckIn, "minute");
    }

    if (!firstCheckIn) {
      setFinalExitTime("No check-in recorded");
      return;
    }

    const requiredMinutes = 8.5 * 60 + (checkInOutTimes.length > 0 ? (dayjs().diff(firstCheckIn, "minute") - totalOfficeMinutes) : 0);
    const adjustedExitTime = firstCheckIn.add(requiredMinutes - overtime, "minute");

    setFinalExitTime(adjustedExitTime.format("hh:mm A"));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Exit Time Calculator</h2>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="Current Check-In Time"
          value={currentCheckIn}
          onChange={(newValue) => setCurrentCheckIn(newValue)}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </LocalizationProvider>

      <Button variant="contained" color="primary" onClick={handleCheckIn} style={{ marginTop: "10px" }}>
        {currentCheckIn ? "Check Out" : "Check In"}
      </Button>

      <div style={{ marginTop: "20px" }}>
        <TextField
          label="Overtime (in minutes, max 60)"
          type="number"
          value={overtime}
          onChange={handleOvertimeChange}
          fullWidth
        />
      </div>

      <Button variant="contained" color="secondary" onClick={calculateExitTime} style={{ marginTop: "10px" }}>
        Calculate Exit Time
      </Button>

      {finalExitTime && (
        <h3 style={{ marginTop: "20px" }}>Final Exit Time: {finalExitTime}</h3>
      )}
    </div>
  );
}

export default App;
