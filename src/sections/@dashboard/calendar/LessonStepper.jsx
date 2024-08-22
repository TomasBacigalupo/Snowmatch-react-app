import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, TextField } from '@mui/material';

const LessonStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    days: '',
    price: '',
    client: ''
  });

  const steps = ['Select Days', 'Set Price', 'Choose Client'];

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    // Submit your formData
    console.log(formData);
  };

  return (
    <>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length ? (
        <Typography variant="h6">
          All steps completed - your lesson is ready to be published!
        </Typography>
      ) : (
        <>
          {activeStep === 0 && (
            <TextField
              label="Select Days"
              name="days"
              value={formData.days}
              onChange={handleChange}
              fullWidth
            />
          )}

          {activeStep === 1 && (
            <TextField
              label="Set Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              fullWidth
            />
          )}

          {activeStep === 2 && (
            <TextField
              label="Choose Client"
              name="client"
              value={formData.client}
              onChange={handleChange}
              fullWidth
            />
          )}

          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </>
      )}
    </>
  );
};

export default LessonStepper;