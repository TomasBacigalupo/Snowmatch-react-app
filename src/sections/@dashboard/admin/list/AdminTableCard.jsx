import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem, Box, Card } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

AdminTableCard.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onEditRow: PropTypes.func,
    onSelectRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
    onWapp: PropTypes.func,
    onEvents: PropTypes.func,
    onContactedChange: PropTypes.func,
    onClick: PropTypes.func,
    showRole: PropTypes.bool,
};

export default function AdminTableCard({ row, selected, onEditRow, onSelectRow, onConfirmRow, onDeclineRow, onWapp, onEvents, onContactedChange, onClick, showRole = true }) {
    const { t } = useTranslation();
    const theme = useTheme();

    const { name, lastname, imageLink, role, level, authorized, state, id, emailVerified, contacted } = row;

    const [openMenu, setOpenMenuActions] = useState(null);

    const handleOpenMenu = (event) => {
        setOpenMenuActions(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpenMenuActions(null);
    };

    return (
        <Card 
            sx={{ 
                width: '100%', 
                my: 0.5,
                cursor: 'pointer'
            }}
            onClick={onClick}
        >
            <Box display='flex' padding={2} flexDirection='column'>
                <Box display='flex' justifyContent='space-between'>
                    <Box display='flex' flexDirection='column'>
                        <Box display='flex' alignItems='center'>
                            <Typography variant='h4'>
                                {`${name} ${lastname}`}
                            </Typography>
                            <Iconify
                                //todo verificar que funcione con cambios de back
                                icon={emailVerified ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
                                sx={{
                                    mx: 1,
                                    width: 20,
                                    height: 20,
                                    color: 'success.main',
                                    ...(!emailVerified && { color: 'warning.main' }),
                                }}
                            />

                        </Box>
                        <Box>
                            <Label
                                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                color={(state === 'UNAVAILABLE' && 'error') || 'success'}
                                sx={{ textTransform: 'capitalize' }}
                            >
                                {state}
                            </Label>
                        </Box>

                    </Box>

                    <Box display="flex" alignItems="center" gap={1} onClick={(e) => e.stopPropagation()}>
                        {onContactedChange && (
                            <Checkbox
                                checked={!!contacted}
                                onChange={(e) => onContactedChange(e.target.checked)}
                            />
                        )}
                        <TableMoreMenu
                            open={openMenu}
                            onOpen={handleOpenMenu}
                            onClose={handleCloseMenu}
                            actions={
                                <>
                                <MenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEvents();
                                        handleCloseMenu();
                                    }}
                                >
                                    <Iconify icon={'eva:calendar-fill'} />
                                    {t('adminReview.menu.events')}
                                </MenuItem>
                                <MenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onWapp();
                                        handleCloseMenu();
                                    }}
                                >
                                    <Iconify icon={'mdi:whatsapp'} />
                                    {t('adminReview.menu.wapp')}
                                </MenuItem>
                                <MenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onConfirmRow();
                                        handleCloseMenu();
                                    }}
                                >
                                    <Iconify icon={'eva:edit-fill'} />
                                    {t('adminReview.menu.edit')}
                                </MenuItem>
                                <MenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeclineRow();
                                        handleCloseMenu();
                                    }}
                                    sx={{ color: 'error.main' }}
                                >
                                    <Iconify icon={'eva:trash-2-outline'} />
                                    {t('adminReview.menu.decline')}
                                </MenuItem>
                                </>
                            }
                        />
                    </Box>
                </Box>
                <Box ml={2} display='flex'>
                    <Box flex='1'>
                        <Typography >
                            {t('adminReview.card.id', { id })}
                        </Typography>
                        <Typography >
                            {t('adminReview.card.level', { level })}
                        </Typography>
                    </Box>
                    {showRole && (
                        <Box flex='1'>
                            <Typography >
                                {t('adminReview.card.role', { role })}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Card>

        // <TableRow hover selected={selected}>
        //     <TableCell padding="checkbox">
        //         <Checkbox checked={selected} onClick={onSelectRow} />
        //     </TableCell>

        //     <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        //         <Avatar alt={name} src={"imageLink"} sx={{ mr: 2 }} />
        //         <Typography variant="subtitle2" noWrap>
        //             {name + " " + lastname}
        //         </Typography>
        //     </TableCell>
        //     <TableCell align="left">
        //         {id}
        //     </TableCell>

        //     <TableCell align="left">
        //         {role}
        //     </TableCell>

        //     <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        //         {level}
        //     </TableCell>

        //     <TableCell align="center">
        //         <Iconify
        //             //todo verificar que funcione con cambios de back
        //             icon={authorized ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
        //             sx={{
        //                 width: 20,
        //                 height: 20,
        //                 color: 'success.main',
        //                 ...(!authorized && { color: 'warning.main' }),
        //             }}
        //         />
        //     </TableCell>

        //     <TableCell align="left">
        //         <Label
        //             variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
        //             color={(state === 'UNAVAILABLE' && 'error') || 'success'}
        //             sx={{ textTransform: 'capitalize' }}
        //         >
        //             {state}
        //         </Label>
        //     </TableCell>

        //     <TableCell align="right">
        //         <TableMoreMenu
        //             open={openMenu}
        //             onOpen={handleOpenMenu}
        //             onClose={handleCloseMenu}
        //             actions={
        //                 <>
        //                     {/* <MenuItem
        //         onClick={() => {
        //           onDeleteRow();
        //           handleCloseMenu();
        //         }}
        //         sx={{ color: 'error.main' }}
        //       >
        //         <Iconify icon={'eva:trash-2-outline'} />
        //         Delete
        //       </MenuItem> */}
        //                     {/* <MenuItem
        //         onClick={() => {
        //           onEditRow();
        //           handleCloseMenu();
        //         }}
        //       >
        //         <Iconify icon={'eva:edit-fill'} />
        //         Edit
        //       </MenuItem> */}
        //                     <MenuItem
        //                         onClick={() => {
        //                             onConfirmRow();
        //                             handleCloseMenu();
        //                         }}
        //                     >
        //                         <Iconify icon={'eva:edit-fill'} />
        //                         Edit
        //                     </MenuItem>
        //                     <MenuItem
        //                         onClick={() => {
        //                             onDeclineRow();
        //                             handleCloseMenu();
        //                         }}
        //                         sx={{ color: 'error.main' }}
        //                     >
        //                         <Iconify icon={'eva:trash-2-outline'} />
        //                         Decline
        //                     </MenuItem>
        //                 </>
        //             }
        //         />
        //     </TableCell>
        // </TableRow>
    );
}
