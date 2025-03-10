import React, { useState, useContext } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  Badge,
  useTheme,
  SvgIcon,
  Grid,
  Paper,
  Stack
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import GavelIcon from '@mui/icons-material/Gavel';
import HelpIcon from '@mui/icons-material/Help';
import InfoIcon from '@mui/icons-material/Info';
import AuthContext from '../context/AuthContext';

// Custom Logo component
const MedConsultLogo = (props) => (
  <SvgIcon {...props} viewBox="0 0 512 512">
    <path 
      d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm0 384c-97.2 0-176-78.8-176-176S158.8 80 256 80s176 78.8 176 176-78.8 176-176 176z" 
      fill="currentColor"
    />
    <path 
      d="M256 128c-70.7 0-128 57.3-128 128s57.3 128 128 128 128-57.3 128-128-57.3-128-128-128zm0 224c-52.9 0-96-43.1-96-96s43.1-96 96-96 96 43.1 96 96-43.1 96-96 96z" 
      fill="currentColor"
    />
    <path 
      d="M256 176c-44.1 0-80 35.9-80 80s35.9 80 80 80 80-35.9 80-80-35.9-80-80-80zm0 128c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z" 
      fill="currentColor"
    />
    <path 
      d="M256 224c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32z" 
      fill="currentColor"
    />
    <path 
      d="M288 256h-64M256 224v64" 
      stroke="currentColor" 
      strokeWidth="32" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="none"
    />
  </SvgIcon>
);

// Cross Logo component
const MedCrossLogo = (props) => (
  <SvgIcon {...props} viewBox="0 0 512 512">
    <path 
      d="M352 144h-64V80c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v64h-64c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64v144c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V208h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16z" 
      fill="currentColor"
    />
    <path 
      d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm0 384c-97.2 0-176-78.8-176-176S158.8 80 256 80s176 78.8 176 176-78.8 176-176 176z" 
      fill="currentColor"
    />
  </SvgIcon>
);

// Footer component
const Footer = () => {
  const theme = useTheme();
  
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 4,
        px: 2,
        backgroundColor: theme.palette.grey[100],
        borderTop: `1px solid ${theme.palette.grey[300]}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  mr: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: theme.palette.primary.main,
                  borderRadius: '50%',
                }}
              >
                <MedCrossLogo sx={{ fontSize: 24, color: 'white' }} />
              </Box>
              <Typography variant="h6" color="primary.main" fontWeight="bold">
                MedConsult
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Providing quality healthcare services through our innovative telemedicine platform. Connect with doctors anytime, anywhere.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton 
                size="small" 
                aria-label="facebook" 
                sx={{ 
                  color: '#3b5998',
                  '&:hover': { bgcolor: 'rgba(59, 89, 152, 0.1)' }
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                size="small" 
                aria-label="twitter" 
                sx={{ 
                  color: '#1DA1F2',
                  '&:hover': { bgcolor: 'rgba(29, 161, 242, 0.1)' }
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton 
                size="small" 
                aria-label="linkedin" 
                sx={{ 
                  color: '#0077B5',
                  '&:hover': { bgcolor: 'rgba(0, 119, 181, 0.1)' }
                }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton 
                size="small" 
                aria-label="instagram" 
                sx={{ 
                  color: '#E1306C',
                  '&:hover': { bgcolor: 'rgba(225, 48, 108, 0.1)' }
                }}
              >
                <InstagramIcon />
              </IconButton>
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <List dense disablePadding>
              <ListItem component={Link} to="/" sx={{ color: 'text.primary', textDecoration: 'none', py: 0.5 }}>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem component={Link} to="/doctors" sx={{ color: 'text.primary', textDecoration: 'none', py: 0.5 }}>
                <ListItemText primary="Find Doctors" />
              </ListItem>
              <ListItem component={Link} to="/consultations" sx={{ color: 'text.primary', textDecoration: 'none', py: 0.5 }}>
                <ListItemText primary="My Consultations" />
              </ListItem>
              <ListItem component={Link} to="/prescriptions" sx={{ color: 'text.primary', textDecoration: 'none', py: 0.5 }}>
                <ListItemText primary="Prescriptions" />
              </ListItem>
              <ListItem component={Link} to="/profile" sx={{ color: 'text.primary', textDecoration: 'none', py: 0.5 }}>
                <ListItemText primary="My Profile" />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
              Support
            </Typography>
            <List dense disablePadding>
              <ListItem component={Link} to="/help" sx={{ color: 'text.primary', textDecoration: 'none', py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <HelpIcon fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText primary="Help Center" />
              </ListItem>
              <ListItem component={Link} to="/faq" sx={{ color: 'text.primary', textDecoration: 'none', py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <InfoIcon fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText primary="FAQ" />
              </ListItem>
              <ListItem component={Link} to="/privacy" sx={{ color: 'text.primary', textDecoration: 'none', py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <PrivacyTipIcon fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText primary="Privacy Policy" />
              </ListItem>
              <ListItem component={Link} to="/terms" sx={{ color: 'text.primary', textDecoration: 'none', py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <GavelIcon fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText primary="Terms of Service" />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>
            <List dense disablePadding>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <LocationOnIcon fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="123 Medical Plaza, Pune Office"
                  secondary="Maharashtra, India"
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <EmailIcon fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText primary="contact@medconsult.com" />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <PhoneIcon fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText primary="+917796807582" />
              </ListItem>
            </List>
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<EmailIcon />}
                size="small"
                component={Link}
                to="/contact"
                sx={{ borderRadius: 4 }}
              >
                Contact Us
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', sm: 'flex-start' } }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} MedConsult. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
            <Typography variant="body2" component={Link} to="/privacy" sx={{ color: 'text.secondary', textDecoration: 'none' }}>
              Privacy
            </Typography>
            <Typography variant="body2" component={Link} to="/terms" sx={{ color: 'text.secondary', textDecoration: 'none' }}>
              Terms
            </Typography>
            <Typography variant="body2" component={Link} to="/cookies" sx={{ color: 'text.secondary', textDecoration: 'none' }}>
              Cookies
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleOpenNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };
  
  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Doctors', icon: <PeopleIcon />, path: '/doctors' },
    { text: 'Consultations', icon: <VideoCallIcon />, path: '/consultations' },
    { text: 'Prescriptions', icon: <DescriptionIcon />, path: '/prescriptions' },
  ];
  
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(45deg, #00796b 30%, #26a69a 90%)',
          color: 'white'
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
        >
          <MedCrossLogo 
            sx={{ 
              fontSize: 50, 
              color: theme.palette.primary.main 
            }} 
          />
        </Box>
        <Typography variant="h6" component="div" fontWeight="bold">
          MedConsult
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Medical Consultation Platform
        </Typography>
      </Box>
      <Divider />
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            onClick={() => isMobile && setDrawerOpen(false)}
            sx={{
              mb: 1,
              mx: 1,
              borderRadius: '8px',
              backgroundColor: isActive(item.path) ? 'rgba(0, 121, 107, 0.08)' : 'transparent',
              color: isActive(item.path) ? 'primary.main' : 'text.primary',
              '&:hover': {
                backgroundColor: 'rgba(0, 121, 107, 0.12)',
              }
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontWeight: isActive(item.path) ? 'bold' : 'regular' 
              }}
            />
            {isActive(item.path) && (
              <Box 
                sx={{ 
                  width: 4, 
                  height: 35, 
                  bgcolor: 'primary.main',
                  borderRadius: '4px',
                  ml: 1
                }} 
              />
            )}
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} MedConsult
        </Typography>
      </Box>
    </Box>
  );
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'white',
          color: 'text.primary',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mr: 2
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  mr: 1,
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: theme.palette.primary.main,
                  borderRadius: '50%',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                <MedCrossLogo 
                  sx={{ 
                    fontSize: 24, 
                    color: 'white' 
                  }} 
                />
              </Box>
              <Typography
                variant="h6"
                noWrap
                component={Link}
                to="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  color: 'primary.main',
                  textDecoration: 'none',
                }}
              >
                MEDCONSULT
              </Typography>
            </Box>
            
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >
              MEDCONSULT
            </Typography>
            
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{ 
                    my: 2, 
                    mx: 0.5,
                    color: isActive(item.path) ? 'primary.main' : 'text.primary',
                    fontWeight: isActive(item.path) ? 'bold' : 'medium',
                    backgroundColor: isActive(item.path) ? 'rgba(0, 121, 107, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 121, 107, 0.12)',
                    },
                    borderRadius: '8px',
                    px: 2
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
            
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Notifications">
                <IconButton 
                  onClick={handleOpenNotificationsMenu} 
                  sx={{ 
                    p: 1,
                    mr: 1,
                    bgcolor: 'rgba(0,0,0,0.04)',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.08)',
                    }
                  }}
                >
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-notifications"
                anchorEl={anchorElNotifications}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElNotifications)}
                onClose={handleCloseNotificationsMenu}
              >
                <MenuItem onClick={handleCloseNotificationsMenu}>
                  <Typography textAlign="center">New consultation request</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseNotificationsMenu}>
                  <Typography textAlign="center">Upcoming consultation in 1 hour</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseNotificationsMenu}>
                  <Typography textAlign="center">New prescription available</Typography>
                </MenuItem>
              </Menu>
              
              <Tooltip title="Open settings">
                <IconButton 
                  onClick={handleOpenUserMenu} 
                  sx={{ 
                    p: 0.5,
                    border: '2px solid',
                    borderColor: 'primary.main'
                  }}
                >
                  <Avatar 
                    alt={user?.name} 
                    src={user?.profilePicture || '/static/images/avatar/2.jpg'} 
                    sx={{ width: 32, height: 32 }}
                  />
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
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {user?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                  <Typography variant="body2" color="primary" fontWeight="medium" sx={{ mt: 0.5 }}>
                    {user?.role === 'doctor' ? 'Doctor' : 'Patient'}
                    {user?.role === 'doctor' && user?.specialization && ` - ${user.specialization}`}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem component={Link} to="/profile" onClick={handleCloseUserMenu}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={() => { handleCloseUserMenu(); handleLogout(); }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: isMobile ? 'block' : 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            position: isMobile ? 'fixed' : 'relative',
            height: isMobile ? '100%' : 'calc(100% - 64px)',
            marginTop: isMobile ? 0 : '64px',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)'
          },
        }}
      >
        {drawer}
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${isMobile ? 0 : 250}px)` },
          ml: { sm: isMobile ? 0 : '250px' },
          mt: '64px'
        }}
      >
        <Outlet />
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Layout; 