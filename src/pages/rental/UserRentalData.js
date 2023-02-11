import { styled } from '@mui/material/styles';
import { Box, Step, StepLabel, Stepper, StepConnector, Grid , Checkbox, StepIcon, MenuItem, Select, TextField, Button, Typography, Dialog} from "@mui/material";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import useLocales from "src/hooks/useLocales";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';

function QontoStepIcon({ active, completed }) {
    return (
        <Box
            sx={{
                zIndex: 9,
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: active ? 'primary.main' : 'text.disabled',
            }}
        >
            {completed ? (
                <Iconify icon={'eva:checkmark-fill'} sx={{ zIndex: 1, width: 20, height: 20, color: 'primary.main' }} />
            ) : (
                <Box
                    sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: 'currentColor',
                    }}
                />
            )}
        </Box>
    );
}

QontoStepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
};

const QontoConnector = styled(StepConnector)(({ theme }) => ({
    top: 10,
    left: 'calc(-50% + 20px)',
    right: 'calc(50% + 20px)',
    '& .MuiStepConnector-line': {
        borderTopWidth: 2,
        borderColor: theme.palette.divider,
    },
    '&.Mui-active, &.Mui-completed': {
        '& .MuiStepConnector-line': {
            borderColor: theme.palette.primary.main,
        },
    },
}));

const initialData = {
    discipline: 'SKI',
    level: 'BEGINNER',
    height: 170,
    wight: 80,
    footSize: 40,
    desireEquipment: {
        ski: true,
        poles: true,
        boots: true,
        helmet: true,
        googles: true,
        gloves: true,
        table: false,
    }
}

const EQUIPMENT = [
    'ski',
    'poles',
    'boots',
    'helmet',
    'googles',
    'gloves',
    'table'
]

export default function UserRentalData({isGuest=false}){
    const {translate} = useLocales() 
    const STEPS = ['Personal Data', 'Equipment', 'Quality', 'Result'];
    const [activeStep, setActiveStep] = useState(0)
    const [formData, setFormData] = useState(initialData)
    const navigate = useNavigate()
    return (
        <Page title={translate('rental.pageTitle')}>
            <Box sx={{width:'100%', padding:'15px'}}>
            <Grid container spacing={1} justifyContent='center' sx={{ width: '100%'}}>
                <Grid item xs={12} md={8} justifyContent='center' sx={{ mb: 5}}>
                    <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                        {STEPS.map((label) => (
                            <Step key={label}>
                                <StepLabel
                                    StepIconComponent={QontoStepIcon}
                                    sx={{
                                        '& .MuiStepLabel-label': {
                                            typography: 'subtitle2',
                                            color: 'text.disabled',
                                        },
                                    }}
                                >
                                    {translate('rental.'+label)}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Grid>

                {activeStep === 0 && (
                    <Grid item xs={12} spacing={1} container sx={{width:'100%', height:'400px'}}>
                        <Grid item xs={12} md={6} justifyContent='center' justifyItems='center'>
                            <Select
                            fullWidth
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={formData.discipline}
                                label={translate('rental.discipline')}
                                helperText={translate('rental.disciplineHelper')}
                                onChange={(event) =>{
                                    setFormData({
                                        ...formData,
                                        discipline: event.target.value
                                    })
                                }}
                            >
                                <MenuItem value={"SKI"}>Ski</MenuItem>
                                <MenuItem value={"SNOWBOARD"}>Snowboard</MenuItem>
                            </Select>
                        </Grid>
                            <Grid item xs={12} md={6} justifyContent='center' justifyItems='center'>
                                <Select
                                    fullWidth
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formData.level}
                                    label={translate('rental.level')}
                                    helperText={translate('rental.levelHelper')}
                                    onChange={(event) => {
                                        setFormData({
                                            ...formData,
                                            level: event.target.value
                                        })
                                    }}
                                >
                                    <MenuItem value={"BEGINNER"}>{translate('rental.BEGINNER')}</MenuItem>
                                    <MenuItem value={"INTERMEDIATE"}>{translate('rental.INTERMEDIATE')}</MenuItem>
                                    <MenuItem value={"EXPERT"}>{translate('rental.EXPERT')}</MenuItem>
                                </Select>
                            </Grid>
                        <Grid item xs={12} md={6} justifyContent='center' justifyItems='center'>
                            <TextField
                                fullWidth
                                    label={translate('rental.height')}
                                    helperText={translate('rental.heightHelper')}
                            onChange={(event) => setFormData({
                                ...formData,
                                height: event.target.value
                            })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} justifyContent='center' justifyItems='center'>
                            <TextField
                                fullWidth
                                    label={translate('rental.weight')}
                                    helperText={translate('rental.weightHelper')}
                                onChange={(event) => setFormData({
                                    ...formData,
                                    weight: event.target.value
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} justifyContent='center' justifyItems='center'>
                            <TextField
                                value={formData.footSize}
                                fullWidth
                                    label={translate('rental.size')}
                                    helperText={translate('rental.sizeHelper')}
                                onChange={(event) => setFormData({
                                    ...formData,
                                    footSize: event.target.value
                                })}
                            />
                        </Grid>
                    </Grid>
                )}
                {activeStep === 1 && (
                        <Grid xs={12} item container justifyContent='space-between' sx={{ width: '100%', height: '400px' }}>
                        {EQUIPMENT.map((e,idx) => {
                            return (
                                <Grid item xs={6} container alignItems='center' >
                                    <Grid item xs={6} justifyContent='space-between' textAlign='center'>
                                        <Typography>{translate('rental.' + e)}</Typography>
                                    </Grid>
                                    <Grid item xs={6} justifyContent='space-between'>
                                        <Checkbox
                                            key={idx}
                                            label={translate('rental.' + e)}
                                            onChange={(event) => {
                                                const newData = formData
                                                newData.desireEquipment['' + e] = event.target.checked
                                                setFormData({...newData})
                                            }}
                                            checked={formData.desireEquipment[e]} />
                                    </Grid>
                                </Grid>
                            )
                        })}
                    </Grid>                    
                )}
                    {activeStep === 2 && (
                        <Grid  container item xs={12} alignItems={'center'} textAlign='center' sx={{ width: '100%', height: 'fit-content' }}>
                            <Grid xs={12} container alignItems={'center'}>
                                <Grid item xs={6}>
                                    <img src='/assets/rental/austria/ski/1.png' />
                                </Grid>
                                <Grid item xs={6} container alignItems='center'> 
                                    <Grid item xs={6} justifyContent='space-between' textAlign='center'>
                                        <Typography>Standard</Typography>
                                    </Grid>
                                    <Grid item xs={6} justifyContent='space-between'>
                                        <Checkbox
                                        />
                                    </Grid>
                                </Grid>
                                
                            </Grid>
                            <Grid xs={12} container alignItems={'center'}>
                                <Grid item xs={6}>
                                    <img src='/assets/rental/austria/ski/2.png' />
                                </Grid>
                                <Grid item xs={6} container alignItems='center'>
                                    <Grid item xs={6} justifyContent='space-between' textAlign='center'>
                                        <Typography>Premium</Typography>
                                    </Grid>
                                    <Grid item xs={6} justifyContent='space-between'>
                                        <Checkbox
                                        />
                                    </Grid>
                                </Grid>
                                
                            </Grid>
                            <Grid xs={12} container alignItems={'center'} >
                                <Grid item xs={6}>
                                    <img src='/assets/rental/austria/ski/3.png' />
                                </Grid>
                                <Grid item xs={6} container alignItems='center'>
                                    <Grid item xs={6} justifyContent='space-between' textAlign='center'>
                                        <Typography>Gold</Typography>
                                    </Grid>
                                    <Grid item xs={6} justifyContent='space-between'>
                                        <Checkbox
                                        />
                                    </Grid>
                                </Grid>
                                
                            </Grid>
                        </Grid>
                    )}
                {activeStep === 3 && (
                        <Grid item xs={12} textAlign='center' sx={{ width: '100%', height: '400px' }}>
                            <Typography variant='h5'>{translate('rental.showResult')}</Typography>
                            <Typography>{`${translate('rental.discipline')}: ${formData.discipline}`}</Typography>
                            <Typography>{`${translate('rental.level')}: ${translate('rental.'+formData.level)}`}</Typography>
                            <Typography>{`${translate('rental.height')}: ${formData.height}`}</Typography>
                            <Typography>{`${translate('rental.weight')}: ${formData.wight}`}</Typography>
                            <Typography>{`${translate('rental.size')} EU: ${formData.footSize}`}</Typography>
                            {formData.desireEquipment.boots &&
                                <Typography>{translate('rental.boots')}: {Math.ceil(Number(formData.footSize) * 0.65)}</Typography>
                            }
                            {formData.desireEquipment.poles &&
                                <Typography>{translate('rental.poles')}: {Math.ceil(Number(formData.height) * 0.7)}cm</Typography>
                            }
                            {formData.desireEquipment.ski &&
                                <Typography>{translate('rental.skiResult', {
                                    from: Math.ceil(Number(formData.height) - 17),
                                    to: Number(formData.height)
                                })}</Typography>
                            }
                            {formData.desireEquipment.table &&
                                <Typography>Snowboard: {Math.ceil(Number(formData.height) - 17)}cm</Typography>
                            }
                            {formData.desireEquipment.gloves &&
                                <Typography>{translate('rental.needsGloves')}</Typography>
                            }
                            {formData.desireEquipment.googles &&
                                <Typography>{translate('rental.needsGoogles')}</Typography>
                            }
                            {formData.desireEquipment.helmet &&
                                <Typography>{translate('rental.needsHelmet')}</Typography>
                            }
                    </Grid>
                )}
                <Grid item xs={6} >
                    <Button
                        disabled={activeStep === 0}
                        fullWidth
                        variant='contained'
                        onClick={() => setActiveStep(activeStep - 1)}
                    >
                            {translate('rental.prev')}
                    </Button>
                </Grid>
                <Grid item xs={6} >
                        {activeStep !== 3 && (
                    <Button 
                    fullWidth
                    disabled={activeStep === 3}
                    variant='contained' 
                    onClick={() => setActiveStep(activeStep+1)}
                    >
                            {translate('rental.next')}
                    </Button>)}
                    {activeStep === 3 && (
                            <Button
                                fullWidth
                                variant='contained'
                                onClick={() => navigate('/')}
                            >
                                FIND YOUR PRO
                            </Button>
                    )}
                </Grid>
            </Grid>
            <Dialog open={true} sx={{width: '100%'}}>
                    <iframe id="inlineFrameExample"
                        title="Inline Frame Example"
                        width="100%"
                        height="100%"
                        src="https://checkout.zenrise.io?token=f8d82336-c158-4d00-941e-9e181452a67b">
                    </iframe>
                    <Button sx={{zIndex:9999}}> Close </Button>

            </Dialog>
            </Box>
        </Page>
        
    )

}
