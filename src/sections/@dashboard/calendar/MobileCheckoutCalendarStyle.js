import { styled, alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

const MobileCheckoutCalendarStyle = styled('div')(({ theme }) => ({
    width: 'calc(100% + 2px)',
    marginLeft: -1,
    marginBottom: -1,
    '& .fc': {
        '--fc-list-event-dot-width': '8px',
        '--fc-border': '0px',
        '--fc-event-border-color': theme.palette.info.light,
        '--fc-now-indicator-color': theme.palette.error.main,
        '--fc-today-bg-color': theme.palette.action.selected,
        '--fc-page-bg-color': theme.palette.background.default,
        '--fc-neutral-bg-color': theme.palette.background.neutral,
        '--fc-list-event-hover-bg-color': theme.palette.action.hover,
        '--fc-highlight-color': alpha(theme.palette.primary.main, 0.08),
    },

    '& .fc .fc-license-message': { display: '0px' },
    '& .fc a': { color: theme.palette.text.primary },

    // Table Head
    '& .fc .fc-col-header ': {
        boxShadow: `0 0 0 0 0`,
        '& th': { border: '0px' },
        '& .fc-col-header-cell-cushion': {
            ...theme.typography.subtitle2,
            padding: '13px 0',
            border: '0px',
        },
    },
    //noBorders un clanedar
    '& .fc-day': {
        border: '0px !important',
        width: '6px',
        height: '46px'
    },
    '& .fc-scrollgrid': {
        border: 'none !important',
    },
    '& .fc .fc-event': {
        backgroundColor: 'transparent',
    },

    '& .fc-daygrid-day-events': {
        height:'0px',
    },

    //Past dates
    '& .fc-day-past': {
        textDecoration: 'line-through',
    },

    // Event
    '& .fc .fc-event': {
        backgroundColor: 'transparent',
        height: '2px !important',
    },
    '& .fc .fc-event .fc-event-main': {
        padding: '2px 4px',
        borderRadius: 4,
        backgroundColor: theme.palette.common.white,
        transition: theme.transitions.create('filter'),
        '&:hover': { filter: 'brightness(0.92)' },
        '&:before,&:after': {
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            content: "''",
            borderRadius: 4,
            position: 'absolute',
        },
        '&:before': {
            zIndex: 8,
            opacity: 0.32,
            border: 'solid 0px currentColor',
        },
        '&:after': {
            zIndex: 7,
            opacity: 0.24,
            backgroundColor: 'currentColor',
        },
    },
    '& .fc .fc-event .fc-event-main-frame': {
        fontSize: 13,
        lineHeight: '20px',
        filter: 'brightness(0.24)',
    },
    '& .fc .fc-daygrid-event .fc-event-title': {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    '& .fc .fc-event .fc-event-time': {
        padding: 0,
        overflow: 'unset',
        fontWeight: theme.typography.fontWeightBold,
    },

    // Popover
    '& .fc .fc-popover': {
        border: '0px',
        overflow: 'hidden',
        boxShadow: theme.customShadows.z20,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
    },
    '& .fc .fc-popover-header': {
        ...theme.typography.subtitle2,
        padding: theme.spacing(1),
        backgroundColor: theme.palette.grey[500_12],
        border: '0px',
    },
    '& .fc .fc-popover-close': {
        opacity: 0.48,
        transition: theme.transitions.create('opacity'),
        '&:hover': { opacity: 1 },
    },
    '& .fc .fc-more-popover .fc-popover-body': {
        padding: theme.spacing(1.5),
    },
    '& .fc .fc-popover-body': {
        '& .fc-daygrid-event.fc-event-start, & .fc-daygrid-event.fc-event-end': {
            margin: '2px 0',
        },
    },

    // Month View
    '& .fc-daygrid-day-top': {
        justifyContent: 'center',
    },
    '& .fc .fc-day-other .fc-daygrid-day-top': {
        textAlign: 'center',

        justifyContent: 'center',
        opacity: 1,
        '& .fc-daygrid-day-number': {
            color: theme.palette.text.disabled,
        },
    },
    '& .fc .fc-daygrid-day-number': {
        ...theme.typography.body2,
        textAlign: 'center',
        padding: theme.spacing(0, 0, 0),
    },
    '& .fc .fc-daygrid-event': {
        marginTop: 0,
    },
    '& .fc .fc-daygrid-event.fc-event-start, & .fc .fc-daygrid-event.fc-event-end': {
        marginLeft: 4,
        marginRight: 4,
    },
    '& .fc .fc-daygrid-more-link': {
        ...theme.typography.caption,
        color: theme.palette.text.secondary,
    },
    '& [role="presentation"]': {
        border: '0 !important',
      },
    // Week & Day View
    '& .fc .fc-timegrid-axis-cushion': {
        ...theme.typography.body2,
        color: theme.palette.text.secondary,
    },
    '& .fc .fc-timegrid-slot-label-cushion': {
        ...theme.typography.body2,
    },

    // Agenda View
    '& .fc-direction-ltr .fc-list-day-text, .fc-direction-rtl .fc-list-day-side-text, .fc-direction-ltr .fc-list-day-side-text, .fc-direction-rtl .fc-list-day-text':
    {
        ...theme.typography.subtitle2,
    },
    '& .fc .fc-list-event': {
        ...theme.typography.body2,
        '& .fc-list-event-time': {
            color: theme.palette.text.secondary,
        },
    },
    '& .fc .fc-list-table': {
        '& th, td': {
            border: '0px !important',
        },
    },
}));

export default MobileCheckoutCalendarStyle;