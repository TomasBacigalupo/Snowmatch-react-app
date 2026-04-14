import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { Button, DialogActions, DialogContent, Grid, TextField, Box, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import useLocales from "src/hooks/useLocales";
export default function SelectRangeDates({ handleClose, onSubmit}) {
    const { translate } = useLocales()
    const [value, setValue] = useState([null, null]);

    return (
        <React.Fragment>
            <DialogContent>
                <Grid container>
                    <Grid item xs={12}>
                        <StaticDateRangePicker
                            displayStaticWrapperAs="mobile"
                            value={value}
                            onChange={(newValue) => {
                                setValue(newValue);
                            }}
                            slotProps={{
                                toolbar: { hidden: true },
                                textField: ({ position }) => ({
                                    fullWidth: true,
                                    sx: position === 'end' ? { mt: 1 } : undefined,
                                }),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>
                            {`${translate('general.total_days')}: ${value[0] && value[1] ? Math.ceil(value[1].getTime() - value[0].getTime()) / (1000 * 3600 * 24) + 1 : 0}`}
                        </Typography>
                    </Grid>

                </Grid>
            </DialogContent>
            <DialogActions>
                <Button fullWidth variant='outlined' onClick={handleClose}>{translate('general.cancel')}</Button>
                <Button fullWidth variant='contained' onClick={()=>onSubmit(value)}>{translate('general.done')}</Button>
            </DialogActions>
        </React.Fragment>

    )
}