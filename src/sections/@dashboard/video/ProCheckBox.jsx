import { Box, Paper, Typography } from "@mui/material";
import useAuth from "src/hooks/useAuth";

const ProCheckBox = () => {
    const { user } = useAuth();

    return (
        <Paper sx={{ borderRadius: 2, borderColor: 'primary.dark', border: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: 2, position: 'relative', margin: 1 }}>
            <img src="/logo/proCheck.png" alt="ProCheck Credits" style={{ width: '50px', height: '50px', borderRadius: '50%', marginLeft: '10px' }} />
            <Typography variant="h6" color="text.primary" style={{ marginLeft: '10px' }}>
                ProCheck <br /> Credits
            </Typography>
            <Box mr={2} width='100%' display="flex" flexDirection='column' justifyContent='flex-end' alignItems='flex-end'>
                <Typography textAlign="left" variant="body1" color="text.primary" style={{ marginLeft: '10px' }}>
                    Total Credits
                </Typography>
                <Typography variant="h3" color="text.primary" style={{ marginLeft: '10px' }}>
                    {user?.proCheckCredits}
                </Typography>
            </Box>
            {/* <IconButton sx={{ position: 'absolute', top: 2, right: 2 }} onClick={() => console.log("setIsProCheckInfoOpen(true)")}>
                                    <HelpOutline sx={{ fontSize: '1rem' }}/>
                                </IconButton> */}
        </Paper>
    )

}

export default ProCheckBox;