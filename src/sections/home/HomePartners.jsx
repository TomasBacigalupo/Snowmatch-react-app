import { Box, Typography } from "@mui/material";
import Image from "src/components/Image";


export default function HomePartners() {
    return (
        <Box
            display="flex"
            justifyContent="space-around"
            alignItems="center"
            marginX="5%"
            marginTop="3%"
            height="80px"
            sx={{
                "@media (max-width: 600px)": {
                    justifyContent: "space-between",
                    overflowX: "scroll",
                },
            }}
        >
            <Image
                src="/assets/certs/logoADIDDESS.png"
                sx={{
                    height: "auto",
                    width: "55px", // Set a fixed width for consistency
                   
                }}
            />
            <Image
                src="/assets/catedral.png"
                sx={{
                    height: "auto",
                    width: "70px", // Set a fixed width for consistency
                    
                }}
            />
            <Image
                src="/assets/ITBA-logo.png"
                sx={{
                    height: "auto",
                    width: "75px", // Set a fixed width for consistency
                   
                }}
            />
            <Image
                src="/assets/salpa.png"
                sx={{
                    height: "auto",
                    width: "80px", // Set a fixed width for consistency
                   
                    display: { xs: "none", md: "block" }, // Hide on mobile, show on larger screens
                }}
            />
            <Image
                src="/assets/trown.png"
                sx={{
                    height: "auto",
                    width: "70px", // Set a fixed width for consistency
                    
                    display: { xs: "none", md: "block" }, // Hide on mobile, show on larger screens
                }}
            />
        </Box>
    );
}
