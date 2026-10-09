import { useState } from 'react';
import { Alert, Box, Button, Grid, MenuItem, Snackbar, Stack, TextField, Typography } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Section from './Section';
import { brand, services } from '../data';

const contacts = [
  { icon: PhoneIcon, label: brand.phone, href: brand.phoneHref },
  { icon: MailOutlineIcon, label: brand.email, href: `mailto:${brand.email}` },
  { icon: PlaceOutlinedIcon, label: brand.address },
  { icon: AccessTimeIcon, label: brand.hours },
];

const options = [...services.map((s) => s.title), 'Потрібна консультація'];

export default function Contact() {
  const [sent, setSent] = useState(false);

  // Форма без бекенду: підключіть Formspree / Web3Forms / AWS Lambda —
  // див. DEPLOY.md, розділ «Форма заявки».
  const onSubmit = (e) => {
    e.preventDefault();
    e.currentTarget.reset();
    setSent(true);
  };

  return (
    <Section id="contact" dark>
      <Grid container spacing={{ xs: 6, md: 10 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="overline" color="primary" component="p">
            Запис
          </Typography>
          <Typography variant="h2" sx={{ mt: 1, mb: 3 }}>
            Запишіться на безкоштовний огляд
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 5 }}>
            Оцінимо стан кузова й салону та запропонуємо оптимальний варіант. Передзвонимо протягом 15 хвилин у
            робочий час.
          </Typography>
          <Stack spacing={3}>
            {contacts.map(({ icon: Icon, label, href }) => (
              <Stack key={label} direction="row" spacing={2} alignItems="center">
                <Box sx={{ width: 44, height: 44, border: '1px solid', borderColor: 'divider', display: 'grid', placeItems: 'center' }}>
                  <Icon color="primary" fontSize="small" />
                </Box>
                <Typography component={href ? 'a' : 'span'} href={href} sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': href && { color: 'primary.main' } }}>
                  {label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Box component="form" onSubmit={onSubmit} sx={{ p: { xs: 3, md: 6 }, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField name="name" label="Ім’я" required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField name="phone" label="Телефон" type="tel" required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField name="car" label="Марка й модель авто" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField name="service" label="Послуга" select defaultValue="">
                  {options.map((o) => (
                    <MenuItem key={o} value={o}>
                      {o}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={12}>
                <TextField name="message" label="Коментар" multiline minRows={3} />
              </Grid>
              <Grid size={12}>
                <Button type="submit" variant="contained" size="large" fullWidth>
                  Надіслати заявку
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
                  Натискаючи кнопку, ви погоджуєтесь з обробкою персональних даних.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Snackbar open={sent} autoHideDuration={5000} onClose={() => setSent(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setSent(false)}>
          Дякуємо! Ми зв’яжемося з вами найближчим часом.
        </Alert>
      </Snackbar>
    </Section>
  );
}
