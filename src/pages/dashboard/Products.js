// @mui
import { Container, Stack } from '@mui/material';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';

export default function Products(){
    return (
        <Page title="Productos" sx={{ height: 1 }}>
            <Container maxWidth={false} sx={{ height: 1 }}>
                <HeaderBreadcrumbs
                    heading="Productos"
                    links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root,
                        },
                        { name: 'Productos' },
                    ]}
                />
                
            </Container>
        </Page>
    )
}