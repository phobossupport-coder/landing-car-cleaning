import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { brand } from '../data';
import { analyticsEnabled } from '../analytics';
import { useLang } from '../i18n';

const HASH = '#privacy';

// Політика конфіденційності: відкривається за посиланням #privacy з будь-якого місця сторінки.
export default function Privacy() {
  const { t } = useLang();
  const p = t.privacy;
  const [open, setOpen] = useState(() => window.location.hash === HASH);

  useEffect(() => {
    const onHash = () => setOpen(window.location.hash === HASH);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const close = () => {
    setOpen(false);
    history.replaceState(null, '', window.location.pathname + window.location.search);
  };

  const fill = (text) => text.replace('{org}', brand.orgNr ? `, org.nr. ${brand.orgNr}` : '').replaceAll('{phone}', brand.phone);
  const sections = analyticsEnabled ? [...p.sections, p.analytics] : p.sections;

  return (
    <Dialog open={open} onClose={close} scroll="paper" maxWidth="sm" fullWidth aria-labelledby="privacy-title">
      <DialogTitle id="privacy-title" sx={{ fontFamily: 'inherit' }}>
        {p.title}
        <Typography variant="body2" color="text.secondary">
          {p.updated}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {sections.map((s) => (
          <div key={s.h}>
            <Typography variant="subtitle2" component="h3" sx={{ mt: 2, mb: 0.5, color: 'primary.main' }}>
              {s.h}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {fill(s.p)}
            </Typography>
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>{p.close}</Button>
      </DialogActions>
    </Dialog>
  );
}
