import React from 'react';
import Chome from '../component/Chome';
import Hnbar from '../component/Hnbar';
import Desc from '../component/Desc';



function Home() {
  return (
    <>
     <div><Hnbar/></div>
      <div><Chome/></div>
      <div style={{ textAlign: 'left', marginLeft: '30px' }}>
        <h5 style={{ margin: '0', padding: '0' }}>Vikum Spice Shop</h5>
      <h1 style={{ marginTop: '0', marginBottom: '0.25rem' }}>who we are</h1>

      </div>
      
      <div><Desc/></div>
    </>
  );
}

export default Home;