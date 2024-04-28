import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useDispatch, useSelector } from 'react-redux';
import { setPremiumTeachers, setStandardTeachers } from 'src/redux/slices/teachers';
import { premiumLesson, standardLesson } from 'src/services/facebook';
import useLocales from 'src/hooks/useLocales';
export default function IndependentShop() {
    const dispatch = useDispatch();
    const { category } = useSelector((state) => state.teachers);
    const { translate } = useLocales();

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

    return (
        <ToggleButtonGroup
            color="primary"
            value={category}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            sx={{
                width: '100%',
                borderRadius: 10,
                justifyContent: 'space-between',
                marginBottom: 2,
            }}
        >
            <ToggleButton
                value="standard"
                sx={{
                    width: '100%',
                    borderRadius: 10,
                    justifyContent: 'center',
                    '&.MuiButtonBase-root': {
                        borderRadius: '100px !important',
                    },
                }}
            >
                {translate('products.group')}
            </ToggleButton>
            <ToggleButton
                value="premium"
                sx={{
                    width: '100%',
                    borderRadius: 10,
                    justifyContent: 'center',
                    '&.MuiButtonBase-root': {
                        borderRadius: '100px !important',
                    },
                }}
            >
                {translate('products.private')}
            </ToggleButton>
        </ToggleButtonGroup>
    );
}