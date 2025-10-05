import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Avatar, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Handle logout
  const handleLogout = async () => {
    try {
      handleClose();
      console.log('Logout initiated...');

      // Call logout function from auth context
      await logout();
      console.log('Logout completed');

      // Call onLogout prop if provided
      if (onLogout) {
        onLogout();
      }

      // Force navigation to login page
      navigate('/login', { replace: true });
      console.log('Redirected to login page');
    } catch (error) {
      console.error('Logout error:', error);

      // Even if logout fails, still redirect to login
      navigate('/login', { replace: true });
    }
  };

  // Navigate to ReportDocument
  const navigateToReportDocument = () => {
    navigate('/reports/ReportDocument');
  };

  // Navigate to ReportChangingofNom
  const navigateToReport = () => {
    navigate('/reports/ReportChangingofNom');
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check for Ctrl+D (or Cmd+D on Mac) to navigate to ReportDocument
      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        navigate('/reports/ReportDocument');
      }
      // Check for Ctrl+R (or Cmd+R on Mac) to navigate to Report
      if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        navigate('/reports/ReportChangingofNom');
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyPress);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [navigate]);

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(135deg,#3414d5 0%,hsl(226, 69.20%, 49.60%) 35%,hsl(347, 82.00%, 47.80%) 100%)',
        width: '100vw',
        boxShadow: '0 4px 20px hsla(251, 85.50%, 43.30%, 0.85)',
        borderBottom: '2px solid#4400ff'
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img src="/Logo1.png" alt="Logo" style={{ width: 280, height: 65, marginLeft: -22 }} />
          <Typography variant="h5" sx={{
            fontWeight: 700,
            color: '#fff',
            letterSpacing: 2,
            textShadow: '2px 2px 4px hsla(30, 86.70%, 47.10%, 0.80)',
            fontFamily: '"Roboto", "Arial", sans-serif'
          }}>
          LION MAYURA ROYAL KINGDOM Mayooram2.0
          </Typography>
        </Box>

        {/* Shortcut Key Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            icon={<DescriptionIcon />}
            label="Ctrl+D"
            onClick={navigateToReportDocument}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                boxShadow: '0 2px 8px rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-1px)'
              },
              '&:active': {
                transform: 'translateY(0)',
                backgroundColor: 'rgba(255, 255, 255, 0.35)'
              }
            }}
            title="Click or press Ctrl+D to go to Document Reports"
          />

          <Chip
            icon={<DescriptionIcon />}
            label="Report (Ctrl+R)"
            onClick={navigateToReport}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                boxShadow: '0 2px 8px rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-1px)'
              },
              '&:active': {
                transform: 'translateY(0)',
                backgroundColor: 'rgba(255, 255, 255, 0.35)'
              }
            }}
            title="Click or press Ctrl+R to go to Reports"
          />

          {/* User Section */}
          {isAuthenticated && user && (
            <Typography
              variant="body2"
              sx={{
                color: '#fff',
                fontWeight: 500,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Welcome, {user.username}
            </Typography>
          )}

          <IconButton onClick={handleMenu} sx={{ p: 0 }}>
            <Avatar
              src="/poruvai.jpg"
              alt={user?.username || "Profile"}
              sx={{ width: 40, height: 40 }}
            >
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          {isAuthenticated && user && (
            <MenuItem disabled sx={{ fontWeight: 'bold', color: '#FF6600' }}>
              {user.username}
              {user.role && ` (${user.role})`}
            </MenuItem>
          )}
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem
            onClick={handleLogout}
            sx={{
              color: '#d32f2f',
              '&:hover': {
                backgroundColor: '#ffebee',
                color: '#c62828'
              }
            }}
          >
            🚪 Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
