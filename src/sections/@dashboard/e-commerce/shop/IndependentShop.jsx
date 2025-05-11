import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useDispatch, useSelector } from 'react-redux';
import { setPremiumTeachers, setStandardTeachers } from 'src/redux/slices/teachers';
import { premiumLesson, standardLesson } from 'src/services/facebook';
import { Typography, Drawer, Button, Hidden } from '@mui/material';
import { Grid, IconButton, Box } from '@mui/material';
import Iconify from "src/components/Iconify";
import useLocales from 'src/hooks/useLocales';
import Markdown from 'src/components/Markdown';
export default function IndependentShop() {
    const dispatch = useDispatch();
    const { category, filters } = useSelector((state) => state.teachers);
    const { level } = filters;
    const { translate } = useLocales();
    const [isOpen, setIsOpen] = React.useState(false);

    const handleChange = (
        event,
        category,
    ) => {
        if (category === 'standard') {
            standardLesson()
            dispatch(setStandardTeachers())
        } else {
            premiumLesson()
            dispatch(setPremiumTeachers())
        }
    };

    const onClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* <ToggleButtonGroup
                color="primary"
                value={category}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
                sx={{
                    width: '100%',
                    borderRadius: 10,
                    justifyContent: 'space-between',
                }}
            >
                <ToggleButton
                    value="standard"
                    sx={{
                        width: '100%',
                        borderRadius: 15,
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        '&.MuiButtonBase-root': {
                            borderRadius: '100px !important',
                        },
                    }}
                >
                    {translate('products.experiences')}
                </ToggleButton>
                <ToggleButton
                    value="premium"
                    sx={{
                        width: '100%',
                        borderRadius: 15,
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        '&.MuiButtonBase-root': {
                            borderRadius: '100px !important',
                        },
                    }}
                >
                    {translate('products.lessons')}
                </ToggleButton>
            </ToggleButtonGroup> */}
            {/* <Drawer
                //className={classes.drawer}
                variant="temporary"
                anchor="top"
                open={isOpen}
                onClose={onClose}
                sx={{
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box', width: '100%', padding: 2, borderBottomLeftRadius: '12px',  // Adjust the value as needed
                        borderBottomRightRadius: '12px',
                        marginBottom: '40px',
                        paddingX: 1
                    }
                }}
            >
                <Box padding={2}
                // className={classes.drawerContainer}
                >
                    <Typography variant="h5" gutterBottom>
                        {translate(`more.${level}.title`)}
                    </Typography>
                    <Markdown>
                        {translate(`more.${level}.description`)}
                    </Markdown>
                </Box>
                <Box width='100%' display='flex' justifyContent='center'>
                    <IconButton onClick={() => setIsOpen(false)}>
                        <Iconify icon="mingcute:up-fill" width={25} height={25} />
                    </IconButton>
                </Box>
            </Drawer> */}
            {/* {category === 'premium' && <Button
                color="inherit"
                variant="text"
                fullWidth sx={{
                    position: 'absolute',
                    left: '50%', // Position the button at 50% of the container's width
                    transform: 'translateX(-50%)', // Move the button back by half of its own width
                    top: 55,
                }} onClick={() => setIsOpen(true)}>
                <Typography sx={{ textDecoration: 'underline' }}>
                    {translate(`more.${level}.button`)}
                </Typography>
            </Button>
            } */}
            <Hidden mdDown>
                {category != 'premium' && <Box
                    color="inherit"
                    variant="text"
                    fullWidth sx={{
                        position: 'absolute',
                        left: '50%', // Position the button at 50% of the container's width
                        transform: 'translateX(-50%)', // Move the button back by half of its own width
                        top: 60,
                    }}>
                    <Typography component='h1'>
                        Clases de ski Catedral
                    </Typography>
                </Box>
                }
            </Hidden>


        </>
    );
}