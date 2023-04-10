import React from 'react';
import { Typography, Chip } from '@mui/material';
import useLocales from 'src/hooks/useLocales';


const skill = (s, idx) => {
    console.log(idx % 4)
    if ((idx + 1) % 4 === 0) {
        console.log("AAAA")
        return (<><br /><Chip key={idx} sx={{ marginLeft: '5px' }} size='small' label={s} variant="outlined" /></>)
    }
    return (<Chip key={idx} sx={{ ml:  idx === 0 ? '0px': '5px', mb: 2 }} size='small' label={s} variant="outlined" />)

}

export default function TeacherSkills(props) {
    return (
        <>
            {props?.skills?.map((s, idx) => {
                return (
                    skill(s, idx)
                )
            })
            }
        </>
    )
}