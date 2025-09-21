import React, { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { useTheme} from '@mui/material/styles';
import {useMediaQuery} from '@mui/material';
import { formatDate } from "@fullcalendar/react";
// @mui
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  Accordion,
  AccordionSummary, Link, AccordionDetails, Typography, Card, Autocomplete, InputAdornment, Popper, Paper, TextField, Drawer, Button, Box, Grid, Modal, CircularProgress
} from '@mui/material';
// hooks
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../../../routes/paths';
// components
import HoverButton from 'src/components/HoverButton';
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import InputStyle from '../../../../components/InputStyle';
import SearchNotFound from '../../../../components/SearchNotFound';
import { FormProvider, RHFMultiCheckbox, RHFAutocomplete } from 'src/components/hook-form';
import { FILTER_CATEGORY_OPTIONS, FILTER_RESORT_OPTIONS } from '../../../@dashboard/e-commerce/shop/ShopFilterSidebar';

import useAuth from 'src/hooks/useAuth';
import useLocales from 'src/hooks/useLocales';
import { useDispatch } from 'src/redux/store';
import { searchTeachers } from 'src/services/facebook';
import { filterTeachers } from 'src/redux/slices/teachers';
import { DesktopDateRangePicker, MobileDateRangePicker, StaticDateRangePicker } from '@mui/lab';
import dayjs from 'dayjs';
import { Language } from '@mui/icons-material';
import axios from 'src/utils/axios';
import { resortTransformation, transformResortsForUI } from 'src/utils/resortTransformation';

// This function will be replaced with API call
const getAllResorts = () => {
    const allResorts = [];
    FILTER_RESORT_OPTIONS.forEach((country) => {
        country.resorts.forEach((resort) => {
            allResorts.push({
                name: resort,
                category: country.category
            });
        });
    });
    return allResorts.sort((a, b) => a.name.localeCompare(b.name));
};

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isMountedRef = useIsMountedRef();

  const [searchQuery, setSearchQuery] = useState('');
  const [resorts, setResorts] = useState([]);
  const [resortsLoading, setResortsLoading] = useState(true);
  const [resortsError, setResortsError] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandedDiscipline, setExpandedDiscipline] = useState(false);
  const [expandedDates, setExpandedDates] = useState(false);
  const [expandedResort, setExpandedResort] = useState(false);


  const { isAuthenticated } = useAuth()

  const { translate, currentLang } = useLocales()

  // Fetch resorts from API
  useEffect(() => {
    const fetchResorts = async () => {
      try {
        setResortsLoading(true);
        setResortsError(null);
        const response = await axios.get('/api/enums/resorts');
        console.log('API response data:', response.data);
        console.log('First resort example:', response.data[0]);
        console.log('Type of first resort:', typeof response.data[0]);
        console.log('Keys of first resort:', Object.keys(response.data[0] || {}));
        setResorts(response.data);
      } catch (err) {
        console.error('Error fetching resorts:', err);
        setResortsError('Error loading resorts');
        // Fallback to static data if API fails
        setResorts(getAllResorts());
      } finally {
        setResortsLoading(false);
      }
    };

    fetchResorts();
  }, []);

  // Transform API data to match the expected format
  const getAllResortsFromAPI = () => {
    if (resorts.length === 0) {
      return getAllResorts(); // Fallback to static data
    }
    
    try {
      return transformResortsForUI(resorts);
    } catch (error) {
      console.error('Error transforming resorts data:', error);
      console.log('Resorts data that caused error:', resorts);
      return getAllResorts(); // Fallback to static data
    }
  };

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

  const onSubmit = (data) => {
    console.log('pase', data)
    
    const resortName = values.resort.value;
    const currentLanguage = currentLang.value;

    //react search
    searchTeachers({
      ...values,
      resort: resortName,
      from: values.range[0],
      to: values.range[1]
    })

    dispatch(filterTeachers({
      ...values,
      resort: resortName,
      from: values.range[0],
      to: values.range[1],
      gender: [],
      language: [],
      discipline: [],
    }))

    // Redirect to /:lng/search/:resort
    navigate(`/${currentLanguage}/search/${encodeURIComponent(resortName)}`);
    
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
    resort: filters.resort ? { name: filters.resort, category: 'Argentina' } : null,
    range: defaultRange,
    from: defaultRange[0],
    to: defaultRange[1],
    // gender: [],
    category: ["Ski"],
    // language: [],
    // discipline: []
  };

  const methods = useForm({
    defaultValues,
    resolver: undefined,
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
          <Typography fontWeight="bold">{resortTransformation(filters.resort)}</Typography>
          <Typography variant="body2" color="text.secondary">
            {`${formatDate(filters.from)} - ${formatDate(filters.to)}`}
          </Typography>
        </Box>
      </Paper>
      <FormProvider width='100%' methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {isMobile ? (
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
                        <Typography>{values.resort?.name || values.resort}</Typography>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Cambiar Montaña
                        </Typography>
                      </Box>
                    </AccordionSummary>
                  }
                  <AccordionDetails>
                    <Typography variant='h3' mb={2}>¿A dónde vas?</Typography>
                    <RHFAutocomplete
                      name="resort"
                      label={translate("filter.resort")}
                      placeholder="Buscar resort..."
                      options={getAllResortsFromAPI()}
                      loading={resortsLoading}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.value}
                      groupBy={(option) => option.category}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          {option.name}
                        </Box>
                      )}
                      filterOptions={(options, { inputValue }) => {
                        const filtered = options.filter((option) =>
                          option.name.toLowerCase().includes(inputValue.toLowerCase())
                        );
                        return filtered;
                      }}
                    />
                    <Box display="flex" gap={2} mt={2} overflow="auto" sx={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
                      {[{title:"Catedral", 
                      image:"/assets/resorts/ilustrations/catedral.png", value:"CERRO_CATEDRAL"},
                       {title:"Chapelco", image:"/assets/resorts/ilustrations/chapelco.png", value:"CHAPELCO"}, 
                       {title:"Bayo", image:"/assets/resorts/ilustrations/bayo.png", value:"CERRO_BAYO"}, {title:"La Hoya", image:"/assets/resorts/ilustrations/lahoya.PNG", value:"LA_HOYA"}].map((resort) => (
                        <Box
                          key={resort}
                          onClick={() => setValue("resort", resort.value)}
                          sx={{
                            minWidth: 120,
                            height: 160,
                            borderRadius: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "#fff",
                            cursor: "pointer",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <Box sx={{ 
                            width: "100%", 
                            height: "120px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 2,
                            backgroundImage: `url(${resort.image})`,
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat"
                          }} />
                          <Box sx={{ 
                            width: "100%",
                            p: 1.5,
                            color: "text.primary",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            borderTop: "1px solid",
                            borderColor: "divider",
                            backgroundColor: "background.paper"
                          }}>
                            {resort.title}
                          </Box>
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
                          {filters?.discipline.length > 0 ? filters?.discipline[0] : 'Ski'}
                        </Typography>}
                    </Box>
                  </AccordionSummary>}
                  {!expandedDiscipline && values?.category?.length != 0 && <AccordionSummary >

                    <Box display='flex' justifyContent='space-between' width='100%'>
                      <Typography>
                        {values?.category[0]}
                      </Typography>
                      {filters.discipline?.length === 0 &&
                        <Typography sx={{ fontWeight: "bold", textAlign:"right", width:"100%" }}>
                          Cambiar
                        </Typography>}
                      {/* {values.discipline?.length != 0 &&
                        <Typography sx={{ fontWeight: "bold" }}>
                          {filters?.discipline?.length > 0 ? filters?.discipline[0] : 'Ski'}
                        </Typography>} */}
                    </Box>
                  </AccordionSummary>}
                  <AccordionDetails>
                    <Typography variant='h3'>¿Qué vas a hacer?</Typography>
                    <RHFMultiCheckbox fullWidth name="category" options={FILTER_CATEGORY_OPTIONS} />
                  </AccordionDetails>
                </Accordion>


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
                {(!expandedDates && !expandedResort) && <Button type='submit' onClick={onSubmit} variant="contained" size="large" startIcon={<Iconify icon={'eva:flash-fill'} width={20} height={20} />}>
                  {translate("landingPRO.search")}
                </Button>}
              </Box>
            </Box>
          </Drawer>
        ) : (
          <Modal
            open={isDrawerOpen}
            onClose={handleCloseDrawer}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: '90%',
                maxWidth: 600,
                maxHeight: '90vh',
                overflow: 'auto',
                bgcolor: '#F7F7F7',
                borderRadius: 2,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                p: 3,
                position: 'relative',
              }}
            >
              <Box display='flex' flexDirection='column' justifyContent='space-between' height='100%'>
                <Box width='100%'>
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
                          <Typography>{values.resort?.name || values.resort}</Typography>
                          <Typography sx={{ fontWeight: "bold" }}>
                            Cambiar Montaña
                          </Typography>
                        </Box>
                      </AccordionSummary>
                    }
                    <AccordionDetails>
                      <Typography variant='h3' mb={2}>¿A dónde vas?</Typography>
                      <RHFAutocomplete
                        name="resort"
                        label={translate("filter.resort")}
                        placeholder="Buscar resort..."
                        options={getAllResortsFromAPI()}
                        loading={resortsLoading}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.value}
                        groupBy={(option) => option.category}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            {option.name}
                          </Box>
                        )}
                        filterOptions={(options, { inputValue }) => {
                          const filtered = options.filter((option) =>
                            option.name.toLowerCase().includes(inputValue.toLowerCase())
                          );
                          return filtered;
                        }}
                      />
                      <Box display="flex" gap={2} mt={2} overflow="auto" sx={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
                        {[{title:"Catedral", value:"CERRO_CATEDRAL"}, {title:"Chapelco", value:"CHAPELCO"}, {title:"Bayo", value:"CERRO_BAYO"}, {title:"La Hoya", value:"LA_HOYA"}].map((resort) => (
                          <Box
                            key={resort}
                            onClick={() => setValue("resort", resort.value)}
                            sx={{
                              minWidth: 120,
                              height: 160,
                              borderRadius: 2,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "space-between",
                              background: "#fff",
                              cursor: "pointer",
                              position: "relative",
                              overflow: "hidden",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              "&:hover": { 
                                transform: "scale(1.02)",
                                transition: "transform 0.2s ease-in-out",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                              },
                            }}
                          >
                            <Box sx={{ 
                              width: "100%", 
                              height: "120px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              p: 2,
                              backgroundImage: `url(${resort.image})`,
                              backgroundSize: "contain",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat"
                            }} />
                            <Box sx={{ 
                              width: "100%",
                              p: 1.5,
                              color: "text.primary",
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: "1rem",
                              borderTop: "1px solid",
                              borderColor: "divider",
                              backgroundColor: "background.paper"
                            }}>
                              {resort.title}
                            </Box>
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
                            {filters?.discipline?.length > 0 ? filters?.discipline[0] : 'Ski'}
                          </Typography>}
                      </Box>
                    </AccordionSummary>}
                    {!expandedDiscipline && values?.category?.length != 0 && <AccordionSummary >

                      <Box display='flex' justifyContent='space-between' width='100%'>
                        <Typography>
                          {values?.category[0]}
                        </Typography>
                        {filters.discipline?.length === 0 &&
                          <Typography sx={{ fontWeight: "bold", textAlign:"right", width:"100%" }}>
                            Cambiar
                          </Typography>}
                        {/* {values.discipline?.length != 0 &&
                          <Typography sx={{ fontWeight: "bold" }}>
                            {filters?.discipline?.length > 0 ? filters?.discipline[0] : 'Ski'}
                          </Typography>} */}
                      </Box>
                    </AccordionSummary>}
                    <AccordionDetails>
                      <Typography variant='h3'>¿Qué vas a hacer?</Typography>
                      <RHFMultiCheckbox fullWidth name="category" options={FILTER_CATEGORY_OPTIONS} />
                    </AccordionDetails>
                  </Accordion>


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

                <Box display='flex' justifyContent='space-between' mt={2}>
                  <Button onClick={handleCloseDrawer}>Borrar todo</Button>
                  {(expandedDates || expandedResort) && (
                    <HoverButton onClick={handleNext} variant="contained" size="large" startIcon={<Iconify icon={'eva:flash-fill'} width={20} height={20} />}>
                      Next
                    </HoverButton>
                  )}
                  {(!expandedDates && !expandedResort) && (
                    <Button type='submit' onClick={onSubmit} variant="contained" size="large" startIcon={<Iconify icon={'eva:flash-fill'} width={20} height={20} />}>
                      {translate("landingPRO.search")}
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Modal>
        )}
      </FormProvider>
    </>


  );
}
