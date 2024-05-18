// @mui
import { Card, Skeleton, Stack } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonProductCategory() {
    return (
        <Card>
            <Stack spacing={2} sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Skeleton variant="circular" sx={{ width: 60, height: 60 }} />
                    <Skeleton variant="text" sx={{ width: '80%' }} />
                </Stack>
            </Stack>
        </Card>
    );
}
