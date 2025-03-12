import { useState } from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

function App() {
  const [checkInTime, setCheckInTime] = useState(null);
  const [intervals, setIntervals] = useState([]);
  const [finalExitTime, setFinalExitTime] = useState(null);

  const handleCheckIn = () => {
    if (!checkInTime) {
      setCheckInTime(dayjs());
    }
  };

  const handleAddInterval = () => {
    setIntervals([...intervals, { exitTime: null, reEntryTime: null }]);
  };

  const handleIntervalChange = (index, key, value) => {
    const updatedIntervals = [...intervals];
    updatedIntervals[index][key] = value;
    setIntervals(updatedIntervals);
  };

  const calculateExitTime = () => {
    if (!checkInTime) {
      setFinalExitTime("No check-in recorded");
      return;
    }

    let totalIntervalMinutes = 0;
    
    intervals.forEach(({ exitTime, reEntryTime }) => {
      if (exitTime && reEntryTime) {
        totalIntervalMinutes += reEntryTime.diff(exitTime, "minute");
      }
    });

    const requiredMinutes = 8.5 * 60 + totalIntervalMinutes;
    const adjustedExitTime = checkInTime.add(requiredMinutes, "minute");
    
    setFinalExitTime(adjustedExitTime.format("hh:mm A"));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <Typography variant="h5" gutterBottom>Exit Time Calculator</Typography>
      
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="Check-In Time"
          value={checkInTime}
          onChange={setCheckInTime}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
      </LocalizationProvider>

      <Button variant="contained" color="primary" onClick={handleCheckIn} style={{ marginTop: "10px" }} disabled={!!checkInTime}>
        Check In
      </Button>

      {checkInTime && (
        <>
          <Typography variant="h6" style={{ marginTop: "20px" }}>Break Intervals</Typography>

          {intervals.map((interval, index) => (
            <Grid container spacing={2} key={index} style={{ marginTop: "10px" }}>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Exit Time"
                    value={interval.exitTime}
                    onChange={(value) => handleIntervalChange(index, "exitTime", value)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Re-entry Time"
                    value={interval.reEntryTime}
                    onChange={(value) => handleIntervalChange(index, "reEntryTime", value)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          ))}

          <Button variant="outlined" onClick={handleAddInterval} style={{ marginTop: "10px" }}>
            Add Interval
          </Button>

          <Button variant="contained" color="secondary" onClick={calculateExitTime} style={{ marginTop: "20px", display: "block" }}>
            Calculate Final Exit Time
          </Button>

          {finalExitTime && <Typography variant="h6" style={{ marginTop: "20px" }}>Final Exit Time: {finalExitTime}</Typography>}
        </>
      )}
    </div>
  );
}

export default App;
