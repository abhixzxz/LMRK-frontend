import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Chip,
  IconButton,
  Container
} from '@mui/material';
import { 
  Star as StarIcon,
  Book as BookIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon
} from '@mui/icons-material';

function Dashboard() {
  const books = [
    { title: 'Tamil', image: '/api/placeholder/200/300' },
    { title: 'English', image: '/api/placeholder/200/300' },
    { title: 'Malayalam', image: '/api/placeholder/200/300' }
  ];

  const masters = [
    { name: 'Thiruvarutprakasa Vallalar', subtitle: 'Ramalinga Swamigal' },
    { name: 'Muchukunda Maharaj', subtitle: 'The great Treta-yuga king' },
    { name: 'SRI ADI SHANKARACHARYA', subtitle: "'Avatar' of Lord Shiva" },
    { name: 'EMPEROR VIKRAMADITYA OF UJJAIN', subtitle: 'The sun of valour' }
  ];

  const events = [
    { title: 'AGNI MAHA HOMAM AT PALANI – MAY 1ST, 2025', date: 'MAY 1, 2025' },
    { title: 'LMRK AT PRAYAGRAJ MAHA KUMBH MELA – A DIVINE GATHERING', date: 'FEBRUARY 17, 2025' },
    { title: 'PALANI FLAG HOISTING/GIRIVALAM/MURUGA HOMAM ON KARTHIGAI DEEPAM DAY', date: 'DECEMBER 13, 2024' }
  ];

  const socialLinks = [
    { icon: FacebookIcon, url: 'https://www.facebook.com/lionmayura' },
    { icon: TwitterIcon, url: 'https://twitter.com/LionMayura' },
    { icon: InstagramIcon, url: 'https://www.instagram.com/lionmayura/' },
    { icon: YouTubeIcon, url: 'https://www.youtube.com/c/lionmayuraroyalkingdom' }
  ];

  return (
    <Container maxWidth={false} sx={{ p: 0 }}>
      {/* Hero Section - OM SARAVANABHAVAYA NAMAHA */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #8B4513 0%, #CD853F 50%, #DEB887 100%)',
          color: 'white',
          textAlign: 'center',
          py: 8,
          mb: 4,
          borderRadius: 2
        }}
      >
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 700, 
            mb: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontSize: { xs: '2rem', md: '3rem' }
          }}
        >
          OM SARAVANABHAVAYA NAMAHA
        </Typography>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600, 
            mb: 4,
            letterSpacing: 2,
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          NEW MURUGA YUGAM
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          sx={{ 
            backgroundColor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.3)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          DISCOVER MORE
        </Button>
      </Box>

      {/* Welcome Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FFF8DC, #F5DEB3)',
          borderRadius: 2,
          p: 4,
          mb: 4,
          textAlign: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <StarIcon sx={{ color: '#8B4513', mr: 1, fontSize: '2rem' }} />
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#8B4513', 
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            LION MAYURA ROYAL KINGDOM
          </Typography>
        </Box>
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#8B4513', 
            mb: 3,
            fontSize: { xs: '1.2rem', md: '1.5rem' }
          }}
        >
          Welcome to LMRK
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: '#5D4037',
            mb: 3,
            maxWidth: '800px',
            mx: 'auto'
          }}
        >
          LION MAYURA ROYAL KINGDOM (LMRK) is a mission started by Shri Rejith Kumar, 
          hailing from Thrissur Kerala, to fulfil the duties given by Muruga Peruman. He has 
          been receiving direct messages from Lord Muruga through prayers and meditation.
        </Typography>
        <Button 
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #8B4513, #CD853F)',
            color: 'white',
            px: 4,
            py: 1.5,
            fontWeight: 600,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(139, 69, 19, 0.3)'
            }
          }}
        >
          READ MORE
        </Button>
      </Box>

      {/* Global Light Body Activation Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FFE4B5, #DEB887)',
          borderRadius: 2,
          p: 4,
          mb: 4,
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#8B4513', 
            fontWeight: 600, 
            mb: 2,
            fontSize: { xs: '1.3rem', md: '1.8rem' }
          }}
        >
          SHRI REJITH KUMAR TO PERFORM GLOBAL LIGHT BODY ACTIVATION WITH LORD MURUGA'S BLESSINGS
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#5D4037',
            fontSize: '1.1rem',
            lineHeight: 1.6
          }}
        >
          Experience the divine transformation through Global Light Body Activation guided by Shri Rejith Kumar under Lord Muruga's divine blessings.
        </Typography>
      </Box>

      {/* Consciousness Shift Section */}
      <Box
        sx={{
          background: 'white',
          borderRadius: 2,
          p: 4,
          mb: 4,
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#8B4513', 
            fontWeight: 600, 
            mb: 3,
            fontSize: { xs: '1.3rem', md: '1.8rem' }
          }}
        >
          Shri Rejith Kumar's Role in the Shift of Consciousness on Earth
        </Typography>
        <Button 
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #8B4513, #CD853F)',
            color: 'white',
            px: 4,
            py: 1.5,
            fontWeight: 600,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(139, 69, 19, 0.3)'
            }
          }}
        >
          DISCOVER MORE
        </Button>
      </Box>

      {/* Books Section */}
      <Box
        sx={{
          background: 'white',
          borderRadius: 2,
          p: 4,
          mb: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <BookIcon sx={{ color: '#8B4513', mr: 1, fontSize: '2rem' }} />
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#8B4513', 
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Sacred Literature
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {books.map((book, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  textAlign: 'center',
                  background: '#FFF8DC',
                  border: '2px solid #DEB887',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(139, 69, 19, 0.2)'
                  }
                }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    height: 300,
                    background: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    color: '#8B4513'
                  }}
                >
                  {book.title} Book Cover
                </CardMedia>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#8B4513', mb: 2 }}>
                    {book.title}
                  </Typography>
                  <Button 
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #8B4513, #CD853F)',
                      color: 'white',
                      '&:hover': {
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Mantra Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FDF5E6, #F5DEB3)',
          borderRadius: 2,
          p: 4,
          mb: 4,
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="h3" 
          sx={{ 
            color: '#8B4513', 
            fontWeight: 700, 
            mb: 2,
            fontSize: { xs: '1.8rem', md: '2.5rem' }
          }}
        >
          OM SARAVANA BHAVAYA NAMAHA
        </Typography>
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#CD853F', 
            fontStyle: 'italic', 
            mb: 2,
            fontSize: { xs: '1.1rem', md: '1.3rem' }
          }}
        >
          Uplifts one's soul by repetition
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#5D4037',
            fontSize: '1.1rem',
            lineHeight: 1.6
          }}
        >
          Shri Rejith leads the meditation of this mantra globally every Sunday at 
          (10.00-10.15) AM (Indian Standard Time).
        </Typography>
      </Box>

      {/* Spiritual Masters Section */}
      <Box
        sx={{
          background: 'white',
          borderRadius: 2,
          p: 4,
          mb: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#8B4513', 
            fontWeight: 700, 
            textAlign: 'center', 
            mb: 4,
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          Divine Guidance
        </Typography>
        <Grid container spacing={3}>
          {masters.map((master, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  textAlign: 'center',
                  background: '#FFF8DC',
                  border: '2px solid #DEB887',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(139, 69, 19, 0.2)'
                  }
                }}
              >
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mt: 2,
                    fontSize: '0.9rem',
                    color: '#8B4513',
                    textAlign: 'center'
                  }}
                >
                  {master.name.split(' ')[0]}
                </Box>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#8B4513', mb: 1, fontSize: '1rem' }}>
                    {master.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#CD853F', fontStyle: 'italic' }}>
                    {master.subtitle}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Events Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FFF8DC, #F5DEB3)',
          borderRadius: 2,
          p: 4,
          mb: 4
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <EventIcon sx={{ color: '#8B4513', mr: 1, fontSize: '2rem' }} />
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#8B4513', 
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            LMRK EVENTS
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          sx={{ 
            textAlign: 'center',
            color: '#CD853F',
            fontStyle: 'italic',
            mb: 3
          }}
        >
          Stay up to Date
        </Typography>
        <Grid container spacing={3}>
          {events.map((event, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  background: 'white',
                  borderLeft: '4px solid #8B4513',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  height: '100%'
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#8B4513', mb: 2, fontSize: '1rem' }}>
                    {event.title}
                  </Typography>
                  <Chip 
                    label={event.date}
                    sx={{ 
                      backgroundColor: '#CD853F',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Locations Section */}
      <Box
        sx={{
          background: 'white',
          borderRadius: 2,
          p: 4,
          mb: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <LocationIcon sx={{ color: '#8B4513', mr: 1, fontSize: '2rem' }} />
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#8B4513', 
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            OUR LOCATIONS
          </Typography>
        </Box>
        <Card 
          sx={{ 
            background: '#FFF8DC',
            border: '2px solid #DEB887',
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: '#8B4513', mb: 2 }}>
              LMRK Head Office:
            </Typography>
            <Typography variant="body1" sx={{ color: '#5D4037', mb: 1 }}>
              Lion Mayura Royal Kingdom
            </Typography>
            <Typography variant="body1" sx={{ color: '#5D4037', mb: 1 }}>
              30, Sri Padma Prabhu Nagar
            </Typography>
            <Typography variant="body1" sx={{ color: '#5D4037', mb: 1 }}>
              Near SR Colony 4th Street
            </Typography>
            <Typography variant="body1" sx={{ color: '#5D4037', mb: 3 }}>
              Madambakkam, Chennai - 126.
            </Typography>
            <Box sx={{ borderTop: '1px solid #DEB887', pt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ color: '#8B4513', mr: 1, fontSize: '1.2rem' }} />
                <Typography variant="body1" sx={{ color: '#5D4037' }}>
                  Contact: +91 7604909191, +91 8903958670
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ color: '#8B4513', mr: 1, fontSize: '1.2rem' }} />
                <Typography variant="body1" sx={{ color: '#5D4037' }}>
                  E-mail: admin@lionmayura.org
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Social Media Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #8B4513, #CD853F)',
          borderRadius: 2,
          p: 4,
          mb: 4,
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'white', 
            fontWeight: 700, 
            mb: 3,
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          Follow Us
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
          {socialLinks.map((social, index) => (
            <IconButton
              key={index}
              component="a"
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'white',
                fontSize: '2rem',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.2)',
                  color: '#FFF8DC'
                }
              }}
            >
              <social.icon fontSize="inherit" />
            </IconButton>
          ))}
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #8B4513, #CD853F)',
          color: 'white',
          textAlign: 'center',
          p: 3,
          borderRadius: 2
        }}
      >
        <Typography variant="body1" sx={{ mb: 1 }}>
          © 2025 ALL RIGHT RESERVED. LION MAYURA ROYAL KINGDOM
        </Typography>
        <Typography variant="body2">
          Building tomorrow's spiritual awakening today.
        </Typography>
      </Box>
    </Container>
  );
}

export default Dashboard;
