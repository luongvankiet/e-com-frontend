import { Box, Card, CardContent, Container, Divider, Stack } from '@mui/material';
import { m } from 'framer-motion';
import { MotionViewport, varFade } from 'src/components/animate';
import { Iconify } from 'src/components/iconify';

const HomeGuarantees = () => (
  <Container
    component={MotionViewport}
    sx={{
      py: 5,
    }}
  >
    <m.div variants={varFade().in}>
      <Card>
        <CardContent>
          <Stack direction="row" spacing={4} divider={<Divider orientation="vertical" flexItem />}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ width: 1 }}>
              <Box
                sx={{
                  width: 65,
                  height: 65,
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
                  width: 65,
                  height: 65,
                  lineHeight: 0,
                  borderRadius: '50%',
                  bgcolor: 'background.neutral',
                  p: 2,
                }}
              >
                <Iconify icon="uil:feedback" width={1} sx={{ color: '#a89f9f' }} />
              </Box>

              <Box sx={{ flexWrap: 'unset' }}>
                <Box sx={{ mb: 1, typography: 'h5' }}>Feedback</Box>
                <Box sx={{ color: 'text.secondary', typography: 'subtitle2' }}>97% positive</Box>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ width: 1 }}>
              <Box
                sx={{
                  width: 65,
                  height: 65,
                  lineHeight: 0,
                  borderRadius: '50%',
                  bgcolor: 'background.neutral',
                  p: 2,
                }}
              >
                <Iconify icon="bx:support" width={1} sx={{ color: '#a89f9f' }} />
              </Box>

              <Box>
                <Box sx={{ mb: 1, typography: 'h5' }}>Online Support</Box>
                <Box sx={{ color: 'text.secondary', typography: 'subtitle2' }}>24/7 daily</Box>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ width: 1 }}>
              <Box
                sx={{
                  width: 65,
                  height: 65,
                  lineHeight: 0,
                  borderRadius: '50%',
                  bgcolor: 'background.neutral',
                  p: 2,
                }}
              >
                <Iconify icon="tdesign:secured" width={1} sx={{ color: '#a89f9f' }} />
              </Box>
              <Box>
                <Box sx={{ mb: 1, typography: 'h5' }}>Payment</Box>
                <Box sx={{ color: 'text.secondary', typography: 'subtitle2' }}>Secure system</Box>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </m.div>
  </Container>
);

export default HomeGuarantees;
