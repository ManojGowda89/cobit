import React from 'react';
import { Snackbar } from '@mui/material';

const Toast = ({ open, message, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      message={message}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          backgroundColor: '#212529',
          color: 'white',
          borderRadius: 1
        }
      }}
    />
  );
};

export default Toast;