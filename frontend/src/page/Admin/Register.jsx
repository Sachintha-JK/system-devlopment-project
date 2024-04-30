import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';



function Register() {
  return (
    <div>
        <div><h1>Register User</h1></div>
      <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          required
          id="outlined-required"
          label="Required"
          defaultValue="Hello World"
        />
        <TextField
          disabled
          id="outlined-disabled"
          label="Disabled"
          defaultValue="Hello World"
        />
       
        
        
      </div>
    </Box>
    </div>
  );
}

export default Register;
