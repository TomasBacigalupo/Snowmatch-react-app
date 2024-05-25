// @mui
import { Card, Skeleton, Stack } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonProductCategory() {
    return (
        <Card>
            <Stack spacing={0} sx={{ p: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">

                    <Skeleton variant="text" sx={{
                        width: '35%',
                    }} />
                    <Skeleton variant="text" sx={{
                        width: '45%',
                        height: '50px'
                    }} />

                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Skeleton variant="text" sx={{
                        width: '45%',
                    }} />
                    <Skeleton variant="text" sx={{
                        width: '10%',
                    }} />
                </Stack>
            </Stack>
        </Card>
    );
}
