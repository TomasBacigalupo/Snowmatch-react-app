// @mui
import { Accordion, Typography, AccordionSummary, AccordionDetails } from '@mui/material';
// _mock_
import { _faqs } from '../../_mock';
// components
import Iconify from '../../components/Iconify';
// hooks
import useLocales from 'src/hooks/useLocales';
import { Trans } from 'react-i18next';

// ----------------------------------------------------------------------

export default function FaqsList() {
  const {translate} = useLocales()
  const questions =[0,1,2,3,4,5,6,7,8] 
  return (
    <>
      {questions.map((i) => (
        <Accordion key={i}>
          <AccordionSummary
            expandIcon={<Iconify icon={'eva:arrow-ios-downward-fill'} width={20} height={20} />}
          >
            <Trans>
              <Typography variant="subtitle1">{translate("faqs.question" + i)}</Typography>
            </Trans>
            
          </AccordionSummary>
          <AccordionDetails>
            <Trans>
              <Typography>{translate("faqs.answer" + i)}</Typography>
            </Trans>
            
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
