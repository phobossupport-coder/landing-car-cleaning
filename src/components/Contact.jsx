import { useState } from 'react';
import { Alert, Box, Button, Collapse, Grid, MenuItem, Snackbar, Stack, TextField, Typography } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Section, { Eyebrow } from './Section';
import Reveal from './Reveal';
import { brand } from '../data';
import { useLang } from '../i18n';
import { serviceOptions, useBooking } from '../booking';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [details, setDetails] = useState(false);
  const { service, setService } = useBooking();
  const { t } = useLang();
  const c = t.contact;
  const f = c.form;
  const contacts = [
    { icon: PhoneIcon, label: brand.phone, href: brand.phoneHref },
    { icon: MailOutlineIcon, label: brand.email, href: `mailto:${brand.email}` },
    { icon: PlaceOutlinedIcon, label: brand.address },
    { icon: AccessTimeIcon, label: c.hours },
  ];
  const options = serviceOptions(t);

  // Форма без бекенду: підключіть Formspree / Web3Forms / AWS Lambda —
  // див. DEPLOY.md, розділ «Форма заявки».
  const onSubmit = (e) => {
    e.preventDefault();
    e.currentTarget.reset();
    setService('');
    setDetails(false);
    setSent(true);
  };

  return (
    <Section id="contact" dark>
      <Grid container spacing={{ xs: 6, md: 10 }} sx={{ mb: { xs: 8, md: 12 } }}>
        {t.trust.map((item, i) => (
          <Grid key={item.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Reveal delay={i * 100}>
              <Box sx={{ borderTop: '1px solid', borderColor: 'primary.main', pt: 2.5 }}>
                <Typography variant="h5" component="h3" sx={{ mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.text}
                </Typography>
              </Box>
            </Reveal>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={{ xs: 6, md: 10 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Reveal>
            <Eyebrow align="left">{c.eyebrow}</Eyebrow>
            <Typography variant="h2" sx={{ mt: 2, mb: 3 }}>
              {c.title}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 5 }}>
              {c.text}
            </Typography>
            <Stack spacing={2.5}>
              {contacts.map(({ icon: Icon, label, href }) => (
                <Stack key={label} direction="row" spacing={2} alignItems="center">
                  <Box sx={{ width: 44, height: 44, border: '1px solid', borderColor: 'divider', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Icon color="primary" sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography
                    component={href ? 'a' : 'span'}
                    href={href}
                    sx={{ color: 'text.primary', textDecoration: 'none', transition: 'color .3s', '&:hover': href && { color: 'primary.main' } }}
                  >
                    {label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Reveal>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Reveal delay={150}>
            <Box component="form" onSubmit={onSubmit} sx={{ p: { xs: 3, md: 6 }, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
              <Grid container spacing={3.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField name="name" label={f.name} required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField name="phone" label={f.phone} type="tel" required />
                </Grid>
                <Grid size={12}>
                  <TextField name="service" label={f.service} select value={service} onChange={(e) => setService(e.target.value)}>
                    {options.map((o) => (
                      <MenuItem key={o.id} value={o.id}>
                        {o.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={12}>
                  {!details && (
                    <Button
                      onClick={() => setDetails(true)}
                      sx={{
                        px: 0,
                        textTransform: 'none',
                        letterSpacing: 0,
                        color: 'text.secondary',
                        '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                      }}
                    >
                      {f.more}
                    </Button>
                  )}
                  <Collapse in={details} unmountOnExit>
                    <Stack spacing={3.5}>
                      <TextField name="car" label={f.car} />
                      <TextField name="message" label={f.message} multiline minRows={2} />
                    </Stack>
                  </Collapse>
                </Grid>
                <Grid size={12}>
                  <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 1 }}>
                    {f.submit}
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
                    {f.consent}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Reveal>
        </Grid>
      </Grid>
      <Snackbar open={sent} autoHideDuration={5000} onClose={() => setSent(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setSent(false)}>
          {f.success}
        </Alert>
      </Snackbar>
    </Section>
  );
}
