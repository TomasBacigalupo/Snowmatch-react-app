import { Grid, Typography } from "@mui/material";
import CertificateItem from "./CertificateItem";
import useAuth from "src/hooks/useAuth";
import { uploadCertificatePicture } from "src/redux/slices/teachers";
import { useDispatch } from "react-redux";

export default function AccountDocuments() {
    const { user } = useAuth()
    const dispatch = useDispatch()
    const handleUpload = (name, image) => {
        dispatch(uploadCertificatePicture(image, name, () => {
            console.log('callBack')
        }))
    }

    return (
        <Grid container >
            {console.log({ user })}
            <Grid item xs={12}>
                <Typography variant='h3'>Certificates</Typography>
            </Grid>
            <CertificateItem
                title="AADIDESS"
                imageLink='/assets/certs/logoADIDDESS.png'
                certificateImageLink={user?.documents?.find(document => document.name === "PSIA")?.link}
                status={user?.documents?.find(document => document.name === "AADIDESS")?.state} />
            <CertificateItem
                title="PSIA"
                imageLink='/assets/certs/logoPSIA.png'
                status={user?.documents?.find(document => document.name === "PSIA")?.state}
                certificateImageLink={user?.documents?.find(document => document.name === "PSIA")?.link}
                onUpload={handleUpload}
            />
        </Grid>
    )
}