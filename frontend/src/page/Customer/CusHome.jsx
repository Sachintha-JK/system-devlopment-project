import React, { useEffect, useState } from 'react';
import CustomerBar from '../../component/CustomerBar';
import Footer from '../../component/Footer';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function CusHome() {
  const navigate = useNavigate();
  const [spices, setSpices] = useState([]);
  const [expandedSpice, setExpandedSpice] = useState(null);

  useEffect(() => {
    // Fetch spice data from the backend when the component mounts
    fetch('http://localhost:8081/spices')
      .then(response => response.json())
      .then(data => setSpices(data))
      .catch(error => console.error('Error fetching spices:', error));
  }, []);

  const handleLearnMoreClick = (spiceName) => {
    setExpandedSpice(spiceName === expandedSpice ? null : spiceName);
  };

  return (
    <>
      <CustomerBar />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', margin: '40px' }}>
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
              <Typography gutterBottom variant="h8" component="div">
                Rs {spice.Selling_Price}
              </Typography>
              {expandedSpice === spice.Spice_Name ? (
                <Typography variant="body2" color="text.secondary">
                  {spice.Description}
                </Typography>
              ) : null}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleLearnMoreClick(spice.Spice_Name)}>
                {expandedSpice === spice.Spice_Name ? 'Show Less' : 'Learn More'}
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
      <Footer />
    </>
  );
}

export default CusHome;
