import { Box, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import { GuestGuard } from 'src/auth/guard';
import Logo from 'src/components/logo';
import { ASSETS_URL } from 'src/config-global';
import { useResponsive } from 'src/hooks/use-responsive';
import { bgGradient } from 'src/theme/css';

const AuthLayout = ({ children, image, title }) => {
  const theme = useTheme();
  const upMd = useResponsive('up', 'md');

  return (
    <GuestGuard>
      <Stack
        component="main"
        direction="row"
        sx={{
          minHeight: '100vh',
        }}
      >
        <Logo
          sx={{
            zIndex: 9,
            position: 'absolute',
            m: { xs: 2, md: 5 },
          }}
        />

        {upMd && (
          <Stack
            flexGrow={1}
            alignItems="center"
            justifyContent="center"
            spacing={3}
            sx={{
              ...bgGradient({
                color: alpha(
                  theme.palette.background.default,
                  theme.palette.mode === 'light' ? 0.6 : 0.94
                ),
                // imgUrl: `${ASSETS_URL}/assets/background/background.gif`,
                imgUrl: `${ASSETS_URL}/assets/background/overlay_2.jpg`,
              }),
            }}
          >
            <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
              {title || 'Hi, Welcome back'}
            </Typography>

            <Box
              component="img"
              alt="auth"
              src={image || `${ASSETS_URL}/assets/illustrations/illustration_dashboard.png`}
              sx={{ maxWidth: 720 }}
            />
          </Stack>
        )}

        <Stack
          sx={{
            width: 1,
            mx: 'auto',
            maxWidth: 480,
            px: { xs: 2, md: 8 },
          }}
        >
          <Outlet />
        </Stack>
      </Stack>
    </GuestGuard>
  );
};

export default AuthLayout;
