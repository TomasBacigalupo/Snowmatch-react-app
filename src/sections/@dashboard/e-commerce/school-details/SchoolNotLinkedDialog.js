import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Link, Typography } from '@mui/material';
import useLocales from 'src/hooks/useLocales';

export default function SchoolNotLinkedDialog({ open, onClose, siteUrl }) {
    const [redirectToSchool, setRedirectToSchool] = useState(false);
    const {translate } = useLocales();

    const handleRedirect = () => {
        setRedirectToSchool(true);
    };

    const handleClose = () => {
        onClose();
    };

    if (redirectToSchool) {
        window.location.href = siteUrl;
        return null;
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{translate('notLinkedSchoolModal.title')}</DialogTitle>
            <DialogContent>
                <Typography gutterBottom>
                    {translate('notLinkedSchoolModal.message')}
                </Typography>
                <Typography>
                    {translate('notLinkedSchoolModal.adminsMessage')}{' '}
                    <Link href="mailto:office@snowmatch.pro">office@snowmatch.pro</Link>.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{translate('notLinkedSchoolModal.cancel')}</Button>
                <Button onClick={handleRedirect}>{translate('notLinkedSchoolModal.redirect')}</Button>
            </DialogActions>
        </Dialog>
    );
}
