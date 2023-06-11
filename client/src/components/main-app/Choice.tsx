import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface TabsProps {
  tab: number;
  handleTab: (event: React.SyntheticEvent, newValue: number) => void;
}


export default function CenteredTabs({tab, handleTab} : TabsProps) {

  return (
    <div style={{display: "block"}}>
    <Box sx={{ width: 'auto', height: "3rem", bgcolor: 'background.paper' }}>
      <Tabs value={tab} onChange={handleTab} centered>
        <Tab label="All" />
        <Tab label="Active" />
        <Tab label="Finished" />
      </Tabs>
    </Box>
    </div>
  );
}