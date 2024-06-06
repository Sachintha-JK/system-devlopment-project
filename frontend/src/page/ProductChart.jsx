import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function ProductChart() {
  const [spices, setSpices] = useState([]);

  useEffect(() => {
    // Fetch spice data from the backend when the component mounts
    fetch('http://localhost:8081/spices')
      .then(response => response.json())
      .then(data => setSpices(data))
      .catch(error => console.error('Error fetching spices:', error));
  }, []);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: '20px', margin: '40px' }}>
        {spices.map(spice => (
          <Card key={spice.Spice_Name} sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: 140 }}
              image={`http://localhost:8081/${spice.Image_Path}`}
              title={spice.Spice_Name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {spice.Spice_Name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {spice.Description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Share</Button>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ProductChart;
