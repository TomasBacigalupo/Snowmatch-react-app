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
            {event?.clients?.length > 0 ? event.clients[0]?.name + ' ' + event.clients[0]?.lastname + ' - ' : ' ' } {event?.owner?.name} {event?.owner?.lastname}
        </Typography>
        <Typography>
            {event?.resort}
        </Typography>
        {//events do not have a status
        /*<Typography>
            State: {event?.status}
        </Typography>*/
        }
        </Stack>
    )

}