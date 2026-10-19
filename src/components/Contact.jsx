import { useState } from 'react';
import { Alert, Box, Button, Grid, Snackbar, Stack, TextField, Typography } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Section from './Section';
import { brand, packageMeta } from '../data';
import { useLang } from '../i18n';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const { t } = useLang();
  const c = t.contact;
  const f = c.form;
  const contacts = [
    { icon: PlaceOutlinedIcon, label: c.area },
    { icon: AccessTimeIcon, label: c.hours },
    { icon: MailOutlineIcon, label: brand.email, href: `mailto:${brand.email}` },
  ];
  const options = [f.winterOption, ...packageMeta.map((p) => `${f.packagePrefix} ${p.name}`), ...t.services.items.map((s) => s.title), f.consult];

  // Форма без бекенду: підключіть Formspree / Web3Forms / AWS Lambda —
  // див. DEPLOY.md, розділ «Форма заявки».
  const onSubmit = (e) => {
    e.preventDefault();
    e.currentTarget.reset();
    setSent(true);
  };

  return (
    <Section id="contact">
      <Grid container spacing={{ xs: 2, md: 2 }} sx={{ mb: { xs: 5, md: 8 } }}>
        {t.trust.map((item) => (
          <Grid key={item.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h5" component="h3" sx={{ mb: 0.5 }}>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.text}
            </Typography>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={{ xs: 4, md: 8 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="h2" component="h2" sx={{ mb: 1.5 }}>
            {c.title}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {c.text}
          </Typography>
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            <Button href={brand.phoneHref} variant="contained" size="large" startIcon={<PhoneIcon />}>
              {brand.phone}
            </Button>
            <Button href={brand.whatsapp} target="_blank" rel="noopener" variant="outlined" size="large" startIcon={<WhatsAppIcon />}>
              WhatsApp
            </Button>
          </Stack>
          <Stack spacing={1.5}>
            {contacts.map(({ icon: Icon, label, href }) => (
              <Stack key={label} direction="row" spacing={1.5} alignItems="center">
                <Icon sx={{ color: 'text.secondary' }} />
                <Typography component={href ? 'a' : 'span'} href={href} sx={{ color: 'text.primary', textDecoration: 'none' }}>
                  {label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Box component="form" onSubmit={onSubmit} sx={{ p: { xs: 2.5, md: 4 }, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <Stack spacing={2}>
              <TextField name="name" label={f.name} required autoComplete="name" />
              <TextField name="phone" label={f.phone} type="tel" required autoComplete="tel" slotProps={{ htmlInput: { inputMode: 'tel' } }} />
              <TextField name="car" label={f.car} />
              <TextField name="service" label={f.service} select defaultValue="" slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}>
                <option value="" />
                {options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </TextField>
              <TextField name="message" label={f.message} multiline minRows={3} />
              <Button type="submit" variant="contained" size="large" fullWidth>
                {f.submit}
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                {f.consent}
              </Typography>
            </Stack>
          </Box>
        </Grid>
      </Grid>
      <Snackbar open={sent} autoHideDuration={5000} onClose={() => setSent(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setSent(false)}>
          {f.success}
        </Alert>
      </Snackbar>
    </Section>
  );
}
