import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Section, { SectionTitle } from './Section';
import { faq } from '../data';

export default function Faq() {
  return (
    <Section id="faq">
      <Grid container spacing={{ xs: 4, md: 10 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SectionTitle align="left" overline="FAQ" title="Часті питання" subtitle="Не знайшли відповідь? Зателефонуйте — проконсультуємо безкоштовно." />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          {faq.map((f, i) => (
            <Accordion key={f.q} disableGutters elevation={0} defaultExpanded={i === 0}>
              <AccordionSummary
                expandIcon={<AddIcon color="primary" />}
                sx={{ px: 0, py: 1.5, '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': { transform: 'rotate(45deg)' } }}
              >
                <Typography variant="h5" component="h3">
                  {f.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0, pb: 3 }}>
                <Typography color="text.secondary">{f.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
      </Grid>
    </Section>
  );
}
