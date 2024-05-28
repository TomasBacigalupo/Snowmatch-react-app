import { styled } from '@mui/system';
import { Accordion as MuiAccordion, AccordionSummary as MuiAccordionSummary, AccordionDetails as MuiAccordionDetails, Typography } from '@mui/material';
import Iconify from '../../components/Iconify';
import useLocales from 'src/hooks/useLocales';
import { Trans } from 'react-i18next';

const Accordion = styled(MuiAccordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none',
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiAccordionSummary-content': {
    margin: theme.spacing(1, 0),
  },
  boxShadow: 'none',
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  boxShadow: 'none',
}));

const QuestionTypography = styled(Typography)(({ theme }) => ({
    fontWeight: theme.typography.fontWeightBold,
  }));
  
  const AnswerTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
  }));
  

export default function FaqsList({ id }) {
  const { translate } = useLocales();
  const questions = [0, 1];
  
  return (
    <>
      {questions.map((i) => (
        <Accordion key={i}>
          <AccordionSummary
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" width="20px" height="20px" />}
          >
            <Trans>
            <Typography variant="subtitle1">
                {translate(`product.${id}.faqs.${i}.question`)}
              </Typography>
            </Trans>
          </AccordionSummary>
          <AccordionDetails>
            <Trans>
            <AnswerTypography>
                {translate(`product.${id}.faqs.${i}.answer`)}
              </AnswerTypography>
            </Trans>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
