import { Grid, Card, Button, Box, Typography, createStyles } from "@mui/material";
import Iconify from "src/components/Iconify";
import UploadDocumentModal from "./modals/UploadDocumentModal";
import { useState } from 'react';
import DocumentInfoModal from "./modals/DocumentInfoModal";
import CertificateItem from "./CertificateItem";
import useAuth from "src/hooks/useAuth";
import { uploadCertificatePicture } from "src/redux/slices/teachers";
import { useDispatch } from "react-redux";

export default function AccountSocialLinks() {
    const [open, setOpen] = useState(false)
    const [infoOpen, setInfoOpen] = useState(false)
    const { user } = useAuth()
    const dispatch = useDispatch()
    const handleUpload = (name, image) => {
        dispatch(uploadCertificatePicture(image,name, ()=>{
            console.log('callBack')
        }))
    }

    return (
        <Grid container >
            {console.log({ user})}
            <Grid item xs={12}>
                <Typography variant='h3'>Certificates</Typography>
            </Grid>
            <CertificateItem title="AADIDESS" imageLink='/assets/certs/logoADIDDESS.png' status={user.documents?.find(document => document.name === "AADIDESS").state} />
            <CertificateItem
                title="PSIA"
                imageLink='/assets/certs/logoPSIA.png'
                status={user.documents.find(document => document.name === "PSIA").state}
                onUpload={handleUpload}
            />
        </Grid>
    )
}