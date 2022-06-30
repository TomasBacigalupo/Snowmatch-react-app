import React from 'react';
import { Typography, Chip } from '@mui/material';
export default function TeacherSkills(props){
    return (
        <>
            <Typography sx={{ marginTop: '1px' }} variant="body2">Skills: </Typography>
            {
                props?.skills?.map((s,idx) => {
                    return <Chip key={idx} sx={{ marginLeft: '5px' }} size='small' label={s} variant="outlined" />
                })
            }
        </>
    )
}