import Page from "src/components/Page";
import PropTypes from 'prop-types';
// @mui
import { Box, Button, Grid, Container, Link, Avatar, IconButton, Typography, InputAdornment, Modal, DialogActions, DialogTitle, DialogContent } from '@mui/material';
// components
import Iconify from 'src/components/Iconify';
import InputStyle from "src/components/InputStyle";
import SearchNotFound from "src/components/SearchNotFound";
import { useState, useEffect } from 'react';
import { DialogAnimate } from 'src/components/animate';
import SocialButtonsDiscounts from 'src/components/SocialButtonsDiscounts';
import DiscountCard from 'src/sections/@dashboard/discounts/DiscountCard'
import { useDispatch, useSelector } from '../../redux/store';
import { getDiscounts, sendDiscount } from '../../redux/slices/discount';


// ----------------------------------------------------------------------

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from "notistack";
// _mock_
import { _userCards, _userFriends } from '../../_mock';
// components
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import HoverButton from "src/components/HoverButton";
import useLocales from "src/hooks/useLocales";


function applyFilter(array, query) {
    if (query) {
        return array.filter((friend) => friend.brand.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }

    return array;
}

export default function Discounts(){
    
    const [open, setOpen] = useState(false)
    const [discount, setDiscount] = useState(null)
    const { themeStretch } = useSettings();
    const [findBrand, setFindBrand] = useState("");
    const {translate} = useLocales()
    const { discounts } = useSelector((state) => state.discounts);
    const dispatch = useDispatch();


    
    const friendFiltered = applyFilter([{
        name: "Salpa",
        description: "La vida es afuera",
        imageUrl: "/assets/salpa.png",
        discount: 40,
        discountDescription: "Desc descuento",
        id: 1,
        igUrl: "https://instagram.com/salpa",
        shopUrl: "https://www.salpa.com.ar",
        fbUrl: ""
    }, {
        name: "Trown",
        description: "Southern Spirit",
        imageUrl: "/assets/trown.png",
        discount: 40,
        discountDescription: "descDescuendo",
        id: 2,
        igUrl: "https://instagram.com/salpa",
        shopUrl: "https://www.salpa.com.ar",
        fbUrl: ""
        }], "");
    const isNotFound = friendFiltered.length === 0;
    const { enqueueSnackbar } = useSnackbar();


    const handleGetBoucher = () =>{
        setOpen(false)
        // send WAPP
        dispatch(sendDiscount(discount.id))
        enqueueSnackbar(translate('discounts.sendNoti'), { variant: 'success', persist: true });
    }

    useEffect(() => {
        dispatch(getDiscounts());
      }, [dispatch]);

    return (
        <Page title="PRO Deal">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="PRO Deal"
                    links={[
                        { name: translate('breadcrumb.dashboard'), href: PATH_DASHBOARD.root },
                        { name: 'Deals' },
                    ]}
                />
                <Box sx={{ mt: 5 }}>
                    <InputStyle
                        stretchStart={240}
                        value={findBrand}
                        onChange={(event) => setFindBrand(event.target.value)}
                        placeholder={translate('discounts.findBrands')}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 5 }}
                    />

                    <Grid container spacing={3}>
                        {discounts.map((d) => (
                            <Grid key={d.id} item xs={12} md={4}>
                                <DiscountCard
                                    company={d}
                                    onClick={() => {
                                        setDiscount(d)
                                        setOpen(true)
                                    }} />
                            </Grid>
                        ))}
                    </Grid>

                    {isNotFound && (
                        <Box sx={{ mt: 5 }}>
                            <SearchNotFound searchQuery={findBrand} />
                        </Box>
                    )}

                    <DialogAnimate open={open} onClose={() => setOpen(false)}>
                        <DialogTitle>{translate('discounts.details')}</DialogTitle>
                        <DialogContent>
                            <br></br>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                   {discount?.discountDescription}
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="outlined" onClick={() => setOpen(false)}>{translate('general.cancel')}</Button>
                            <HoverButton variant="contained" onClick={handleGetBoucher}>{translate('discounts.getCupon')}</HoverButton>
                        </DialogActions>
                    </DialogAnimate>

                </Box>
            </Container>
        </Page>
    )
}