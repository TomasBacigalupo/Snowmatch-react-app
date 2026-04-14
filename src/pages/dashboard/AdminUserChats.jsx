import { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
// @mui
import {
  Box,
  Button,
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { formatDistanceToNowStrict } from 'date-fns';
// utils
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import { ChatWindow } from '../../sections/@dashboard/chat';
import useAuth from '../../hooks/useAuth';
import LoadingScreen from '../../components/LoadingScreen';

// ----------------------------------------------------------------------

const PAGE_SIZE = 50;

function participantLabel(p) {
  if (!p) return '—';
  const last = p.lastname || p.lastName || '';
  const name = [p.name, last].filter(Boolean).join(' ').trim();
  return name || p.email || String(p.id);
}

function previewText(conv) {
  const m = conv.messages?.length ? conv.messages[conv.messages.length - 1] : null;
  if (!m) return '—';
  if (m.contentType === 'image') return 'Photo';
  return m.body || '—';
}

function lastActivityLabel(conv) {
  const m = conv.messages?.length ? conv.messages[conv.messages.length - 1] : null;
  const raw = m?.createdAt || conv.createdAt;
  if (!raw) return '—';
  try {
    const d = typeof raw === 'string' && raw.includes('T') && !raw.includes('Z') && !/[+-]\d{2}:?\d{2}$/.test(raw)
      ? new Date(`${raw}Z`)
      : new Date(raw);
    if (Number.isNaN(d.getTime())) return '—';
    return formatDistanceToNowStrict(d, { addSuffix: true });
  } catch {
    return '—';
  }
}

// ----------------------------------------------------------------------

export default function AdminUserChats() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { themeStretch } = useSettings();
  const { isAdmin, isInitialized } = useAuth();

  if (!isInitialized) {
    return <LoadingScreen isDashboard />;
  }
  if (!isAdmin) {
    return <Navigate to={PATH_DASHBOARD.root} replace />;
  }

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadPage = useCallback(async (pageToLoad, append) => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/chat/conversations', {
        params: { page: pageToLoad, size: PAGE_SIZE },
      });
      const list = res.data.conversations || [];
      const t =
        res.data.totalCount != null
          ? Number(res.data.totalCount)
          : Number(res.headers['x-total-count'] || 0);
      setTotal(t);
      if (append) {
        setRows((prev) => [...prev, ...list]);
      } else {
        setRows(list);
      }
    } catch (e) {
      console.error(e);
      if (!append) {
        setRows([]);
        setTotal(0);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!conversationId) {
      setPage(0);
      loadPage(0, false);
    }
  }, [conversationId, loadPage]);

  const handleRowClick = (id) => {
    navigate(PATH_DASHBOARD.admin.userChatsView(id));
  };

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    loadPage(next, true);
  };

  if (conversationId) {
    return (
      <Page title="User chats">
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <HeaderBreadcrumbs
            heading="User chats"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'User chats', href: PATH_DASHBOARD.admin.userChats },
            ]}
          />
          <Button
            startIcon={<Iconify icon="eva:arrow-back-fill" />}
            onClick={() => navigate(PATH_DASHBOARD.admin.userChats)}
            sx={{ mb: 2 }}
          >
            Back to list
          </Button>
          <Card sx={{ height: { xs: 'calc(100dvh - 180px)', md: 'calc(100dvh - 200px)' }, display: 'flex' }}>
            <ChatWindow />
          </Card>
        </Container>
      </Page>
    );
  }

  return (
    <Page title="User chats">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="User chats"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'User chats' }]}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          All user chat threads, newest first (read-only).
        </Typography>
        <Card>
          <TableContainer sx={{ maxHeight: 'calc(100dvh - 220px)' }}>
            <Scrollbar>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={100}>ID</TableCell>
                    <TableCell>Participants</TableCell>
                    <TableCell>Last message</TableCell>
                    <TableCell width={160}>Activity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((conv) => {
                    const id = conv.conversationId ?? conv.id;
                    const [p1, p2] = conv.participants || [];
                    return (
                      <TableRow
                        key={id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleRowClick(id)}
                      >
                        <TableCell>{id}</TableCell>
                        <TableCell>
                          {participantLabel(p1)}
                          <Typography component="span" variant="body2" color="text.secondary" sx={{ mx: 0.5 }}>
                            ↔
                          </Typography>
                          {participantLabel(p2)}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 360 }}>
                            {previewText(conv)}
                          </Typography>
                        </TableCell>
                        <TableCell>{lastActivityLabel(conv)}</TableCell>
                      </TableRow>
                    );
                  })}
                  {!loading && rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                          <Typography color="text.secondary">No conversations found.</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Card>
        {rows.length > 0 && rows.length < total && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button variant="outlined" onClick={handleLoadMore} disabled={loading}>
              {loading ? 'Loading…' : 'Load more'}
            </Button>
          </Box>
        )}
      </Container>
    </Page>
  );
}
