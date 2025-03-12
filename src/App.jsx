import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

function App() {
  const [checkInOutTimes, setCheckInOutTimes] = useState([]);
  const [currentCheckIn, setCurrentCheckIn] = useState(null);
  const [overtime, setOvertime] = useState(0);
  const [finalExitTime, setFinalExitTime] = useState(null);

  const handleCheckInOut = () => {
    if (!currentCheckIn) {
      setCurrentCheckIn(dayjs());
    } else {
      setCheckInOutTimes([...checkInOutTimes, { checkIn: currentCheckIn, checkOut: dayjs() }]);
      setCurrentCheckIn(null);
    }
  };

  const handleOvertimeChange = (event) => {
    const minutes = Math.min(60, Math.max(0, parseInt(event.target.value, 10) || 0));
    setOvertime(minutes);
  };

  const calculateExitTime = () => {
    if (checkInOutTimes.length === 0 && !currentCheckIn) {
      setFinalExitTime("No check-in recorded");
      return;
    }

    let totalMinutes = 0;
    let firstCheckIn = checkInOutTimes[0]?.checkIn || currentCheckIn;

    checkInOutTimes.forEach(({ checkIn, checkOut }) => {
      totalMinutes += checkOut.diff(checkIn, "minute");
    });

    if (currentCheckIn) {
      totalMinutes += dayjs().diff(currentCheckIn, "minute");
    }

    const requiredMinutes = 8.5 * 60;
    const adjustedExitTime = firstCheckIn.add(requiredMinutes - overtime, "minute");
    setFinalExitTime(adjustedExitTime.format("hh:mm A"));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Exit Time Calculator</h2>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="Current Check-In Time"
          value={currentCheckIn}
          onChange={setCurrentCheckIn}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
      </LocalizationProvider>
      
      <Button variant="contained" color="primary" onClick={handleCheckInOut} style={{ marginTop: "10px" }}>
        {currentCheckIn ? "Check Out" : "Check In"}
      </Button>
      
      <TextField
        label="Overtime (in minutes, max 60)"
        type="number"
        value={overtime}
        onChange={handleOvertimeChange}
        fullWidth
        margin="normal"
      />
      
      <Button variant="contained" color="secondary" onClick={calculateExitTime} style={{ marginTop: "10px" }}>
        Calculate Exit Time
      </Button>
      
      {finalExitTime && <h3 style={{ marginTop: "20px" }}>Final Exit Time: {finalExitTime}</h3>}
    </div>
  );
}

export default App;
