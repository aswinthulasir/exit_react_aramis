import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 , backgroundColor:'#212121'}}>
     <AppBar 
    position="static"
    sx={{ 
      backgroundColor: "#212121", // Background color of AppBar
      minHeight: "64px", // Ensure consistent height
    }}
  >
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ padding: "20px", display: "flex", alignItems: "center" }}>
        <img 
          src="https://aramis.ai/wp-content/uploads/2021/09/logo.svg" 
          alt="Aramis Logo" 
          style={{ height: "40px", width: "auto" }} // Adjust height & maintain aspect ratio
        />
      </Box>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
         <Typography
  variant="h6"
  component="div"
  sx={{
    background: "linear-gradient(90deg, #00b0ff 0%, #00e676 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "semi-bold",
    fontSize:"24px"
  }}
>
  essentials
</Typography>
          
        </Toolbar>
      </AppBar>
    </Box>
  );
}
