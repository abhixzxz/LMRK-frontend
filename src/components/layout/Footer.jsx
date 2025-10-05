import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => (
  <Box sx={{ py: 1, textAlign: 'center', bgcolor: 'grey.300' }}>
    <Typography variant="body2" color="text.secondary">
      &copy; {new Date().getFullYear()} Safe Software and Integrated Solutions P Vt Ltd Ph :9037175684
    </Typography>
  </Box>
);

export default Footer;
