import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Section, { SectionTitle } from './Section';
import { useLang } from '../i18n';

export default function Faq() {
  const { t } = useLang();
  return (
    <Section id="faq" dark>
      <SectionTitle title={t.faq.title} subtitle={t.faq.subtitle} />
      <div style={{ maxWidth: 800 }}>
        {t.faq.items.map((f, i) => (
          <Accordion key={f.q} disableGutters elevation={0} defaultExpanded={i === 0}>
            <AccordionSummary
              expandIcon={<AddIcon color="primary" />}
              sx={{ px: 0, minHeight: 56, '& .MuiAccordionSummary-expandIconWrapper': { transition: 'transform .2s' }, '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': { transform: 'rotate(45deg)' } }}
            >
              <Typography variant="h5" component="h3">
                {f.q}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 0, pt: 0, pb: 2.5 }}>
              <Typography color="text.secondary">{f.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </Section>
  );
}
