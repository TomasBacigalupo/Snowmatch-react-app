import { Grid, Typography, Box } from "@mui/material";
import CountUp from "react-countup";
import useLocales from "src/hooks/useLocales";
export default function HomeVideoStats() {
    const { translate } = useLocales();
    return (
    <Grid spacing={2} container justifyContent='center' justifyItems='center' textAlign='center' p={1}>
            {[1, 2, 3].map((item) => (
                <Grid item container xs={12} md={4} justifyContent='center'>
                    <Box display='flex' justifyContent='center' flexDirection='column' alignItems='center'>
                        <CountUp enableScrollSpy={true} end={Number(translate(`home.videoStats.${item}.total`))} duration={5} delay={0}>
                            {({ countUpRef }) => (
                                <Typography variant='h2' ref={countUpRef} />
                            )}
                        </CountUp>
                        <Typography variant='h4'>{translate(`home.videoStats.${item}.title`)}</Typography>
                        <Typography variant='body-2'>{translate(`home.videoStats.${item}.description`)}</Typography>
                    </Box>
                </Grid>
            ))
            }
        </Grid>
    );
}