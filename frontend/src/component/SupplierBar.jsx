
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import CusProfile from './CusProfile';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdbIcon from '@mui/icons-material/Adb';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';

const pages = ['Home','Appointment', 'Payments','Price List']; // Change the display names
const settings = [
    { label: 'Home', route: '/suphome' },
  { label: 'Profile', route: '/profile' },
  { label: 'Change Password', route: '/cpassword' },
  { label: 'Logout', route: '/logout' }
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (route) => {
    setAnchorElUser(null);
    if (route) {
      navigate(route);
    }
  };

  const handleOpenProfileDialog = () => {
    setOpenProfileDialog(true);
    handleCloseUserMenu();
  };

  const handleCloseProfileDialog = () => {
    setOpenProfileDialog(false);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#333', color: '#fff' }}>
      <Toolbar disableGutters sx={{ marginLeft: '30px', marginRight: '30px', backgroundColor: '#333', color: '#fff' }}>
        <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          Spice Mart
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
  {pages.map((page, index) => (
    <Button
      key={index}
      component={Link}
      to={page === 'Appointments' ? '/appointment' :(page === 'Home' ? '/suphome' : (page === 'Payments' ? '/spayments' : (page === 'Price List' ? '/pricelevel' : (page === 'Order Details' ? '/pendingoc' : `/${page.toLowerCase()}`))))}
      sx={{ my: 2, color: '#fff', display: 'block' }}
      onClick={handleCloseNavMenu}
    >
      {page}
    </Button>
  ))}
</Box>


        

        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <AccountCircleIcon sx={{ fontSize: '32px', color: '#fff' }} />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting.label} onClick={() => handleCloseUserMenu(setting.route)}>
                <Typography textAlign="center">{setting.label}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <Dialog open={openProfileDialog} onClose={handleCloseProfileDialog}>
          <CusProfile />
        </Dialog>
      </Toolbar>
    </AppBar>
  );
}

export default ResponsiveAppBar;
