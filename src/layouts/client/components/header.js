import { AppBar, Box, Button, Container, Stack, Toolbar, useTheme } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from 'src/auth/context';
import Logo from 'src/components/logo';
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
import { HEADER } from 'src/layouts/config-layout';
import { ProfileDropdown } from 'src/layouts/dashboard/components';
import { paths } from 'src/paths';
import { bgBlur } from 'src/theme/css';
import HeaderShadow from './header-shadow';
import NavDesktop from './nav/desktop/nav-desktop';
import NavMobile from './nav/mobile/nav-mobile';

const Header = () => {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  const { user } = useContext(AuthContext);

  return (
    <AppBar sx={{ backgroundColor: theme.palette.background.default }}>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(['height'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(offsetTop && {
            ...bgBlur({
              color: theme.palette.background.default,
            }),
            height: {
              md: HEADER.H_DESKTOP_OFFSET,
            },
          }),
        }}
      >
        <Container sx={{ height: 1, display: 'flex', alignItems: 'center' }}>
          {!mdUp && <NavMobile offsetTop={offsetTop} />}

          <Logo link="/" />

          <Box sx={{ flexGrow: 1 }} />

          {mdUp && <NavDesktop offsetTop={offsetTop} />}

          <Stack alignItems="center" direction={{ xs: 'row', md: 'row-reverse' }}>
            {!user ? (
              <Button variant="outlined" href={paths.auth.login}>
                Login
              </Button>
            ) : (
              <ProfileDropdown />
            )}
          </Stack>
        </Container>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
};

export default Header;
