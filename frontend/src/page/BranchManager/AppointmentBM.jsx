// src/TabViewPage.js
import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import BmNbar from '../../component/BmNbar';
import AppointmentE from '../../component/AppointmentE';
//import TabTwoComponent from './components/TabTwoComponent';

const TabViewPage = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <div>
       < div><BmNbar/></div>
        <Box sx={{ width: '100%' }}>
            <Tabs value={selectedTab} onChange={handleChange}>
                <Tab label="Tab One" />
                <Tab label="Tab Two" />
            </Tabs>
           {selectedTab === 0 && < AppointmentE/>}
            {/*selectedTab === 1 && <TabTwoComponent />*/}
        </Box>
        </div>
    );
};

export default TabViewPage;
