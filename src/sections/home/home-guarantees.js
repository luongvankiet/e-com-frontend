import { Box, Card, CardContent, Container, Divider, Stack } from '@mui/material';
import { MotionViewport } from 'src/components/animate';
import { Iconify } from 'src/components/iconify';

const HomeGuarantees = () => (
  <Container
    component={MotionViewport}
    sx={{
      py: { xs: 10, md: 15 },
    }}
  >
    <Card>
      <CardContent>
        <Stack direction="row" spacing={4} divider={<Divider orientation="vertical" flexItem />}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ width: 1 }}>
            <Box
              sx={{
                width: 78,
                height: 78,
                lineHeight: 0,
                borderRadius: '50%',
                bgcolor: 'background.neutral',
                p: 2,
              }}
            >
              <Iconify icon="tabler:truck-delivery" width={1} sx={{ color: '#a89f9f' }} />
            </Box>
            <Box>
              <Box sx={{ mb: 1, typography: 'h5' }}>Fast Delivery</Box>
              <Box sx={{ color: 'text.secondary', typography: 'subtitle2' }}>Start from $10</Box>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ width: 1 }}>
            <Box
              sx={{
                width: 78,
                height: 78,
                lineHeight: 0,
                borderRadius: '50%',
                bgcolor: 'background.neutral',
                p: 2,
              }}
            >
              <Iconify icon="tabler:truck-delivery" width={1} sx={{ color: '#a89f9f' }} />
            </Box>

            <Box>
              <Box sx={{ mb: 1, typography: 'h5' }}>Money Guarantee</Box>
              <Box sx={{ color: 'text.secondary', typography: 'subtitle2' }}>7 Days Back</Box>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ width: 1 }}>
            <Box
              sx={{
                width: 78,
                height: 78,
                lineHeight: 0,
                borderRadius: '50%',
                bgcolor: 'background.neutral',
                p: 2,
              }}
            >
              <Iconify icon="tabler:truck-delivery" width={1} sx={{ color: '#a89f9f' }} />
            </Box>

            <Box>
              <Box sx={{ mb: 1, typography: 'h5' }}>365 Days</Box>
              <Box sx={{ color: 'text.secondary', typography: 'subtitle2' }}>Start from $10</Box>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ width: 1 }}>
            <Box
              sx={{
                width: 78,
                height: 78,
                lineHeight: 0,
                borderRadius: '50%',
                bgcolor: 'background.neutral',
                p: 2,
              }}
            >
              <Iconify icon="tabler:truck-delivery" width={1} sx={{ color: '#a89f9f' }} />
            </Box>
            <Box>
              <Box sx={{ mb: 1, typography: 'h5' }}>Payment</Box>
              <Box sx={{ color: 'text.secondary', typography: 'subtitle2' }}>Start from $10</Box>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  </Container>
);

export default HomeGuarantees;
