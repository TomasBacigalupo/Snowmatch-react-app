import React from 'react';
import { Typography, Chip } from '@mui/material';
import useLocales from 'src/hooks/useLocales';
export default function TeacherSkills(props){
    const{translate} = useLocales()
    return (
        <>
            <Typography sx={{ marginTop: '1px' }} variant="body2">{translate('teacherDetails.skills')}: </Typography>
            {
                props?.skills?.map((s,idx) => {
                    return <Chip key={idx} sx={{ marginLeft: '5px' }} size='small' label={s} variant="outlined" />
                })
            }
        </>
    )
}