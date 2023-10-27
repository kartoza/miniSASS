import React from "react";
import { TextField, Grid, Paper, Typography, InputLabel } from '@mui/material';
import { Facebook, YouTube, Phone, Google, Email } from '@mui/icons-material';
import { Button, Img, List, Text } from "../../components";

const ContactForm: React.FC = () => {
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={4} md={3} style={{ background: '#0e4981', padding: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px', background: 'none', boxShadow: 'none' }}>
          <Typography variant="h6" style={{ color: '#fff' }}>
            Connect with us
          </Typography>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255, 255, 255, 0.5)', marginLeft:'5%', marginRight:'2%'}}>
            <Facebook fontSize="large" style={{ color: '#fff' }} />
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255, 255, 255, 0.5)', marginRight:'2%' }}>
            <YouTube fontSize="large" style={{ color: '#fff' }} />
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255, 255, 255, 0.5)', marginRight:'2%' }}>
            <Google fontSize="large" style={{ color: '#fff' }} />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <Phone fontSize="large" style={{ color: '#fff' }} />
            <Typography variant="body1" style={{ marginLeft: '10px', color: '#fff' }}>
              071456231
            </Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <Email fontSize="large" style={{ color: '#fff' }} />
            <Typography variant="body1" style={{ marginLeft: '10px', color: '#fff' }}>
              info@minisass.org
            </Typography>
          </div>
          
        </Paper>
      </Grid>
      <Grid item xs={12} sm={8} md={6} style={{ background: 'none' }}>
        <Paper elevation={3} style={{ padding: '20px', background: 'none', boxShadow: 'none' }}>
          <Typography variant="h5" gutterBottom style={{ color: '#fff' }}>
            Contact Us
          </Typography>
          <form>
            <InputLabel htmlFor="name" style={{ color: '#fff' }}>Name</InputLabel>
            <TextField
              label=""
              variant="standard"
              fullWidth
              margin="normal"
              required
              InputProps={{ style: { borderBottom: '1px solid #fff',color: '#fff' } }}
            />
            <InputLabel htmlFor="email" style={{ color: '#fff' }}>Email</InputLabel>
            <TextField
              label=""
              variant="standard"
              fullWidth
              margin="normal"
              required
              InputProps={{ style: { borderBottom: '1px solid #fff',color: '#fff' } }}
            />
            <InputLabel htmlFor="message" style={{ color: '#fff' }}>Message</InputLabel>
            <TextField
              label=""
              variant="standard"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              required
              InputProps={{ style: { borderBottom: '1px solid #fff',color: '#fff' } }}
            />
            <Button
                  className="cursor-pointer flex items-center justify-center min-w-[200px] mt-9"
                  rightIcon={
                    <Img
                      className="h-[18px] mt-px mb-[3px] ml-2.5"
                      src="images/img_arrowright_white_a700.svg"
                      alt="arrow_right"
                    />
                  }
                  shape="round"
                  color="blue_gray_500"
                  size="sm"
                  variant="fill"
                >
                  <div className="text-left text-lg tracking-[0.81px]">
                    Submit
                  </div>
                </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ContactForm;
