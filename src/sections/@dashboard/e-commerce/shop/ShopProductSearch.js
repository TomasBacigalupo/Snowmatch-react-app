import React, { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';
import { formatDate } from "@fullcalendar/react";
// @mui
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  Accordion,
  AccordionSummary, Link, AccordionDetails, Typography, Card, Autocomplete, InputAdornment, Popper, Paper, TextField, Drawer, Button, Box, Grid
} from '@mui/material';
// hooks
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
// utils
import axios from '../../../../utils/axios';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../../../routes/paths';
// components
import HoverButton from 'src/components/HoverButton';
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import InputStyle from '../../../../components/InputStyle';
import SearchNotFound from '../../../../components/SearchNotFound';
import { FormProvider, RHFMultiCheckbox, RHFSelect } from 'src/components/hook-form';
import { FILTER_CATEGORY_OPTIONS, FILTER_RESORT_OPTIONS } from '../../../@dashboard/e-commerce/shop/ShopFilterSidebar';

import useAuth from 'src/hooks/useAuth';
import useLocales from 'src/hooks/useLocales';
import { useDispatch } from 'src/redux/store';
import { searchTeachers } from 'src/services/facebook';
import { filterTeachers } from 'src/redux/slices/teachers';
import { DesktopDateRangePicker, MobileDateRangePicker, StaticDateRangePicker } from '@mui/lab';
import dayjs from 'dayjs';


// ----------------------------------------------------------------------

const PopperStyle = styled((props) => <Popper placement="bottom-start" {...props} />)({
  width: '280px !important',
});

// ----------------------------------------------------------------------

export default function ShopProductSearch({ filters, teachers }) {
  const navigate = useNavigate();
  const theme = useTheme()
  const dispatch = useDispatch()
  const { isTeacher, user } = useAuth()

  const isMountedRef = useIsMountedRef();

  const [searchQuery, setSearchQuery] = useState('');

  const [searchResults, setSearchResults] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandedDiscipline, setExpandedDiscipline] = useState(false);
  const [expandedDates, setExpandedDates] = useState(false);
  const [expandedResort, setExpandedResort] = useState(false);


  const { isAuthenticated } = useAuth()

  const { translate } = useLocales()

  const handleChangeSearch = async () => {
    setSearchResults(teachers)
  };

  const handleClick = (email) => {
    if (isAuthenticated) {
      navigate(PATH_DASHBOARD.eCommerce.viewTeacher(email))
    }
    else {
      navigate(PATH_GUEST.viewTeacher(email));
    }
  };

  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);

  const onSubmit = () => {
    searchTeachers({
      ...values,
      from: values.range[0],
      to: values.range[1]
    })
    
    dispatch(filterTeachers({
      ...values,
      from: values.range[0],
      to: values.range[1]
    }))

    if (values.resort === "Cerro Catedral") {
      if (isTeacher) {
        navigate('/dashboard/e-commerce/independent?resort=Cerro Catedral')
      } else {
        navigate(PATH_DASHBOARD.eCommerce.matchIndependant)
      }

    } else {
      if (isTeacher) {
        navigate(`/dashboard/e-commerce/shop/school?resort=${values.resort}`)
      } else {
        navigate(`/match/school?resort=${values.resort}`)
      }

    }
    handleCloseDrawer()
  }

  const handleNext = () => {
    if (expandedResort) {
      setExpandedDates(true)
    }
    if (expandedDates) {
      setExpandedDiscipline(true)
    }
  }

  const defaultRange = [
    filters.from,
    filters.to,
  ]
  const defaultValues = {
    resort: filters.resort,
    range: defaultRange,
    from: defaultRange[0],
    to: defaultRange[1],
    gender: [],
    category: ["Ski"],
    language: [],
    discipline: []
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (expandedDiscipline) {
      setExpandedDates(false);
      setExpandedResort(false);
    }
  }, [expandedDiscipline, setExpandedDiscipline, setExpandedDates, setExpandedResort])

  useEffect(() => {
    if (expandedDates) {
      setExpandedDiscipline(false);
      setExpandedResort(false);
    }
  }, [expandedDates, setExpandedDiscipline, setExpandedDates, setExpandedResort])

  useEffect(() => {
    if (expandedResort) {
      setExpandedDates(false);
      setExpandedDiscipline(false);
    }
  }, [expandedResort, setExpandedDiscipline, setExpandedDates, setExpandedResort])

  useEffect(() => {
    if (!isDrawerOpen) {
      setExpandedDates(false);
      setExpandedDiscipline(false);
      setExpandedResort(false);
    }
    if (isDrawerOpen) {
      setExpandedResort(true);
    }
  }, [isDrawerOpen, setExpandedDates, setExpandedDiscipline, setExpandedResort])


  return (
    <>
      <Paper
        fullWidth
        elevation={3}
        onClick={handleOpenDrawer} // Opens the drawer on click
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // Center contents horizontally
          px: 2,
          py: 1,
          borderRadius: 10,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          position: 'relative', // Needed for absolute positioning of the icon
        }}
      >
        {/* Search Icon */}
        <Box
          sx={{
            position: 'absolute',
            left: 16, // Adjust as needed
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Iconify icon="eva:search-fill" sx={{ width: 24, height: 24, color: 'text.disabled' }} />
        </Box>

        {/* Centered Text */}
        <Box component="li" display="flex" flexDirection="column" alignItems="center">
          <Typography fontWeight="bold">{filters.resort}</Typography>
          <Typography variant="body2" color="text.secondary">
            {`${formatDate(filters.from)} - ${formatDate(filters.to)}`}
          </Typography>
        </Box>
      </Paper>

      <Drawer
        anchor="top"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            height: '100%',
            borderRadius: '0 0 16px 16px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
            p: 3,
            backgroundColor: '#F7F7F7',
            paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)',
          },
        }}
      >
        <Box display='flex' flexDirection='column' justifyContent='space-between' height='100%'>
          <Box width='100%'>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Accordion
                expanded={expandedResort}
                onChange={() => setExpandedResort(!expanded)}
                sx={{ borderRadius: 1, my: 2, width: "100%", "&::before": { display: "none" } }}>
                {!expandedResort && !values.resort &&
                  <AccordionSummary sx={{
                    borderRadius: 10
                  }}>
                    <Box display='flex' justifyContent='space-between' width='100%'>
                      <Typography>{translate("filter.resort")}</Typography>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Seleccionar montaña
                      </Typography>
                    </Box>
                  </AccordionSummary>
                }
                {!expandedResort && values.resort &&
                  <AccordionSummary sx={{
                    borderRadius: 10
                  }}>
                    <Box display='flex' justifyContent='space-between' width='100%'>
                      <Typography>{values.resort}</Typography>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Cambiar Montaña
                      </Typography>
                    </Box>
                  </AccordionSummary>
                }
                <AccordionDetails>
                  <Typography variant='h3' mb={2}>¿A dónde vas?</Typography>
                  <RHFSelect name="resort" label={translate("filter.resort")} placeholder="Resort">
                    <option value="" />
                    {FILTER_RESORT_OPTIONS.map((country) => (
                      <optgroup key={country.category} label={country.category}>
                        {country.resorts.sort().map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </RHFSelect>
                  <Box display="flex" gap={2} mt={2} overflow="auto" sx={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
                    {["Catedral", "Chapelco", "Bayo", "La Hoya"].map((resort) => (
                      <Box
                        key={resort}
                        onClick={() => setValue("resort", resort)} // Assuming `setValue` is from react-hook-form
                        sx={{
                          minWidth: 100,
                          height: 100,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#F7F7F7",
                          cursor: "pointer",
                          fontWeight: "bold",
                          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                          "&:hover": { backgroundColor: "#EAEAEA" },
                        }}
                      >
                        {resort}
                      </Box>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expandedDates}
                onChange={() => setExpandedDates(!expanded)}
                sx={{ borderRadius: 1, my: 2, "&::before": { display: "none", width: '100%' } }}
              >
                {!expandedDates && !values.range && <AccordionSummary>
                  <Box display='flex' justifyContent='space-between' width='100%'>
                    <Typography>
                      Fecha
                    </Typography>
                    {console.log("filters", filters)}
                    {console.log("values", values)}
                    <Typography sx={{ fontWeight: "bold" }}>
                      Agregar fechas
                    </Typography>
                  </Box>
                </AccordionSummary>}
                {!expandedDates && values.range && <AccordionSummary>
                  <Box display='flex' justifyContent='space-between' width='100%'>
                    {`${new Date(values.range[0]).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'numeric',
                    })} - ${new Date(values.range[1]).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'numeric',
                    })}`}
                    {console.log("filters", filters)}
                    {console.log("values", values)}
                    <Typography sx={{ fontWeight: "bold" }}>
                      Cambiár fechas
                    </Typography>
                  </Box>
                </AccordionSummary>}
                <AccordionDetails>
                  <Typography variant='h3'>¿Cúando vas?</Typography>
                  <Controller
                    name="range"
                    control={control}
                    onChange={() => setExpanded(false)}
                    render={({ field }) => (
                      <StaticDateRangePicker
                        showToolbar={false}
                        {...field}
                        disablePast
                        calendars={1}
                        defaultValue={[dayjs("2022-04-17"), dayjs("2022-04-21")]}
                        renderInput={(startProps, endProps) => (
                          <Box display="flex" alignItems="center">
                            <TextField
                              {...startProps}
                              label={translate("landingPRO.start_date")}
                              placeholder={translate("landingPRO.start_date")}
                            />
                            <Box sx={{ mx: 2 }}> - </Box>
                            <TextField
                              {...endProps}
                              label={translate("landingPRO.end_date")}
                              placeholder={translate("landingPRO.start_date")}
                            />
                          </Box>
                        )}
                      />
                    )}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expandedDiscipline}
                onChange={() => setExpandedDiscipline(!expanded)} sx={{ borderRadius: 1, my: 2, width: "100%", "&::before": { display: "none" } }}>
                {!expandedDiscipline && values?.category?.length === 0 && <AccordionSummary >

                  <Box display='flex' justifyContent='space-between' width='100%'>
                    <Typography>
                      Disciplina
                    </Typography>
                    {filters.discipline?.length === 0 &&
                      <Typography sx={{ fontWeight: "bold" }}>
                        Seleccionar
                      </Typography>}
                    {values.discipline?.length != 0 &&
                      <Typography sx={{ fontWeight: "bold" }}>
                        {filters.discipline[0]}
                      </Typography>}
                  </Box>
                </AccordionSummary>}
                {!expandedDiscipline && values?.category?.length != 0 && <AccordionSummary >

                  <Box display='flex' justifyContent='space-between' width='100%'>
                    <Typography>
                      {values?.category[0]}
                    </Typography>
                    {filters.discipline?.length === 0 &&
                      <Typography sx={{ fontWeight: "bold" }}>
                        Cambiar
                      </Typography>}
                    {values.discipline?.length != 0 &&
                      <Typography sx={{ fontWeight: "bold" }}>
                        {filters.discipline[0]}
                      </Typography>}
                  </Box>
                </AccordionSummary>}
                <AccordionDetails>
                  <Typography variant='h3'>¿Qué vas a hacer?</Typography>
                  <RHFMultiCheckbox fullWidth name="category" options={FILTER_CATEGORY_OPTIONS} />
                </AccordionDetails>
              </Accordion>

            </FormProvider>
            {/* <Box sx={{ my: 2 }}>
              <Typography variant="subtitle1">Desired Teacher</Typography>
              <Autocomplete
                size="medium"
                style={{
                  border: 'none'
                }}
                fullWidth
                onClick={handleOpenDrawer}
                popupIcon={null}
                options={searchResults}
                onInputChange={(event, value) => handleChangeSearch(value)}
                getOptionLabel={(product) => product.name + " " + product.lastname}
                noOptionsText={<SearchNotFound searchQuery={searchQuery} />}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField {...params} placeholder={translate('general.search')} fullWidth sx={{
                  }} />
                )}
                renderOption={(props, product, { inputValue }) => {
                  const { name, lastname, email, imageLink, id } = product;
                  const matches = match(name + " " + lastname, inputValue);
                  const parts = parse(name + " " + lastname, matches);

                  return (
                    <li {...props} onClick={() => handleClick(id)}>
                      <Image alt={name} src={imageLink} sx={{ width: 48, height: 48, borderRadius: 1, flexShrink: 0, mr: 1.5 }} />
                      <Link underline="none" onClick={() => handleClick(id)}>
                        {parts.map((part, index) => (
                          <Typography
                            key={index}
                            component="span"
                            variant="subtitle2"
                            color={part.highlight ? 'primary' : 'textPrimary'}
                          >
                            {part.text}
                          </Typography>
                        ))}
                      </Link>
                    </li>
                  );
                }}
              />
            </Box> */}
          </Box>

          <Box display='flex' justifyContent='space-between'>
            <Button onClick={handleCloseDrawer}>Borrar todo</Button>
            {(expandedDates || expandedResort) && <HoverButton onClick={handleNext} variant="contained" size="large" startIcon={<Iconify icon={'eva:flash-fill'} width={20} height={20} />}>
              Next
            </HoverButton>}
            {(!expandedDates && !expandedResort) && <HoverButton onClick={onSubmit} variant="contained" size="large" startIcon={<Iconify icon={'eva:flash-fill'} width={20} height={20} />}>
              {translate("landingPRO.search")}
            </HoverButton>}
          </Box>
        </Box>
      </Drawer>
    </>


  );
}
