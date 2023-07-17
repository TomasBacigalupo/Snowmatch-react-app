import { Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';

AdminEventInfo.propTypes = {
    event: PropTypes.object,
};
export default function AdminEventInfo({event}){  
     console.log(event) 
    return (
        <Stack>
        <Typography>
            {event?.students ? event.students[0]?.name + ' ' + event.students[0]?.lastname : '' } - {event?.owner?.name} {event?.owner?.lastname}
        </Typography>
        <Typography>
            {event?.resort}
        </Typography>
        <Typography>
            State: {event?.status}
        </Typography>
        </Stack>
    )

}