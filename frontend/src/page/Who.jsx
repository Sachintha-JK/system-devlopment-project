import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'; // Import Grid component
import WhoImage from '../assets/who.png'; // Import the image
import Hnbar from '../component/Hnbar';
import Footer from '../component/Footer';

const card = (
  <React.Fragment>
    <CardContent>
      <Typography sx={{ fontSize: 16, marginBottom: 2 }} color="text.secondary" gutterBottom>
        Introduction
      </Typography>
      <Typography variant="h5" component="div" sx={{ fontSize: 28, fontWeight: 'bold', marginBottom: 2 }}>
        Who We Are
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 18 }}>
        Welcome to Vikum Spice! We're your go-to place for all things spicy in Sri Lanka. With five branches spread across Hambantota and Matara, we're right where you need us to be. What makes us special? Well, we're not just any old spice company. We take pride in bringing you the best of Sri Lanka's spice scene, straight from local farmers. Cinnamon, karunka, pepper, cloves - you name it, we've got it, and it's all top-notch quality. At Vikum Spice, we believe in fair partnerships with our local farmers. We work closely with them to ensure that they receive fair prices for their harvests. By directly sourcing our spices from these farmers, we're able to cut out unnecessary middlemen and offer competitive prices to both our local and export customers.
      </Typography>
      <br />
      <Typography variant="body2" sx={{ fontSize: 18 }}>
        So, if you're looking for a reliable partner to supply you with high-quality Sri Lankan spices, look no further than Vikum Spice. Get in touch with us today to discuss your needs and let us help you spice up your export business!
      </Typography>
    </CardContent>
  </React.Fragment>
);

function Who() {
  return (
    <div>
        <div><Hnbar/></div>
    <Box sx={{ width: '100%', marginTop: '50px' }}>
      <Grid container spacing={8}>
        <Grid item xs={6}>
          <Card variant="elevation" elevation={0} sx={{ textAlign: 'left', marginLeft: '50px', width: 'calc(100% - 50px)' }}>
            {card}
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined" sx={{ width: '550px', height: '550px' }}>
            <img src={WhoImage} alt="Who We Are" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Card>
        </Grid>
      </Grid>
    </Box>
    <div><Footer/></div>
    </div>
  );
}

export default Who;
