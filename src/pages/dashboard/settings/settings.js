import { Avatar, Box, Card, CardContent, Link, Stack, Typography, Container } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';
import { Helmet } from 'react-helmet-async';
import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PROJECT_NAME } from 'src/config-global';

const Settings = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Dashboard: Settings | {PROJECT_NAME}</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Settings"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Settings' }]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Grid container stack={1}>
          <Grid xs={12} md={4}>
            <Link
              component={RouterLink}
              href={paths.dashboard.settings.roles.root}
              sx={{ color: 'white' }}
            >
              <SettingCard
                key="roles"
                name="Roles"
                description="Assign user roles and permissions"
                icon="material-symbols:manage-accounts"
              />
            </Link>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Settings;

const SettingCard = ({ name, description, icon }) => (
  <Card
    sx={{
      width: 1,
      borderRadius: 1.5,
      textTransform: 'capitalize',
    }}
  >
    <CardContent>
      <Stack direction="row" spacing={2}>
        <Avatar sx={{ width: 50, height: 50 }}>
          <Iconify icon={icon} width={34} sx={{ color: 'grey' }} />
        </Avatar>

        <Box>
          <Typography variant="subtitle1" noWrap>
            {name}
          </Typography>

          <Typography variant="caption" component="div" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);
