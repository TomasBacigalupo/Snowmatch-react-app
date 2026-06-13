import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import useAuth from '../../hooks/useAuth';
import { PATH_DASHBOARD } from '../../routes/paths';
import { ADMIN_BOOKING_RESORT_OPTIONS, formatAdminBookingResortLabel } from '../../utils/adminBookingResortOptions';
import { useDispatch, useSelector } from '../../redux/store';
import {
  assignResortAdmin,
  findUserByEmail,
  getResortAdmins,
  revokeResortAdmin,
} from '../../redux/slices/admin';
import { Navigate } from 'react-router-dom';

export default function AdminResortAdmins() {
  const { themeStretch } = useSettings();
  const { isAdmin } = useAuth();
  const dispatch = useDispatch();
  const { resortAdmins, searchedUser, isLoading, error } = useSelector((state) => state.admin);

  const [email, setEmail] = useState('');
  const [selectedResort, setSelectedResort] = useState('CERRO_CATEDRAL');
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      dispatch(getResortAdmins(1));
    }
  }, [dispatch, isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/access-denied" replace />;
  }

  const handleSearch = async () => {
    setSearchError('');
    try {
      await dispatch(findUserByEmail(email.trim().toLowerCase()));
    } catch (err) {
      setSearchError('User not found');
    }
  };

  const handleAssign = async () => {
    if (!searchedUser?.id) return;
    await dispatch(assignResortAdmin(searchedUser.id, selectedResort));
    await dispatch(getResortAdmins(1));
  };

  const handleRevoke = async (userId) => {
    await dispatch(revokeResortAdmin(userId));
    await dispatch(getResortAdmins(1));
  };

  return (
    <Page title="Resort Admins">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Resort Admins"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Admin', href: PATH_DASHBOARD.admin.root },
            { name: 'Resort Admins' },
          ]}
        />

        <Stack spacing={3}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Assign resort admin
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
              <TextField
                label="User email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={handleSearch} disabled={!email || isLoading}>
                Search
              </Button>
            </Stack>

            {searchError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {searchError}
              </Alert>
            )}

            {searchedUser && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Found: {searchedUser.name} {searchedUser.lastname} ({searchedUser.email}) — role: {searchedUser.role}
                </Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }} alignItems={{ md: 'center' }}>
                  <FormControl sx={{ minWidth: 240 }}>
                    <InputLabel>Resort</InputLabel>
                    <Select
                      label="Resort"
                      value={selectedResort}
                      onChange={(e) => setSelectedResort(e.target.value)}
                    >
                      {ADMIN_BOOKING_RESORT_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button variant="contained" onClick={handleAssign} disabled={isLoading}>
                    Assign RESORT_ADMIN
                  </Button>
                </Stack>
              </Box>
            )}
          </Card>

          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Resort</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(resortAdmins || []).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.name} {row.lastname}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{formatAdminBookingResortLabel(row.managedResort)}</TableCell>
                      <TableCell align="right">
                        <Button color="error" onClick={() => handleRevoke(row.id)}>
                          Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!resortAdmins?.length && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                          No resort admins assigned yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {error && (
            <Alert severity="error">
              {String(error?.message || error)}
            </Alert>
          )}
        </Stack>
      </Container>
    </Page>
  );
}
