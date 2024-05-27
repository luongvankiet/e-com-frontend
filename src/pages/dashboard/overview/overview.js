import Container from '@mui/material/Container';
import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PROJECT_NAME } from 'src/config-global';
import { Overview as OverviewSection } from 'src/sections/overview';

const Overview = () => (
  <>
    <Helmet>
      <title> Dashboard: Overview | {PROJECT_NAME}</title>
    </Helmet>

    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Overview"
        links={[
          {
            name: '',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <OverviewSection />
    </Container>
  </>
);

export default Overview;
