import { Box, Button, Card, Container, Link, Stack, Typography } from '@mui/material';
import { m } from 'framer-motion';

import { MotionViewport, varFade } from 'src/components/animate';
import { Iconify } from 'src/components/iconify';
import Image from 'src/components/image/image';
import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';
import { BrandService } from 'src/services/brand-service';

const HomeFeaturedBrands = () => {
  const { brands } = BrandService.useGetBrandList({ perPage: 2 });

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: 5,
      }}
    >
      <m.div variants={varFade().inUp}>
        <Stack spacing={3} sx={{ mb: 5 }}>
          <m.div variants={varFade().inDown}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h3">Featured Brands</Typography>
              <Button
                component={RouterLink}
                href={paths.dashboard.products.create}
                variant="outlined"
                endIcon={<Iconify icon="icon-park-solid:right-one" />}
              >
                More
              </Button>
            </Stack>
          </m.div>

          <Box
            gap={2}
            display="grid"
            alignItems="center"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
              md: 'repeat(6, 1fr)',
            }}
          >
            {brands.map((brand, index) => (
              <m.div variants={varFade().inUp} key={`${brand.name}-${index}`}>
                <Link component={RouterLink} href="/">
                  <Card
                    sx={{
                      textAlign: 'center',
                      bgcolor: 'background.default',
                      p: (theme) => theme.spacing(5, 5),
                      '&:hover': {
                        color: 'text.secondary',
                      },
                    }}
                  >
                    <Image
                      src={brand.image?.url}
                      alt={brand.name}
                      sx={{ mx: 'auto', width: 100, borderRadius: 100 }}
                      ratio="1/1"
                    />

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                      {brand.name}
                    </Typography>
                  </Card>
                </Link>
              </m.div>
            ))}
          </Box>
        </Stack>
      </m.div>
    </Container>
  );
};

export default HomeFeaturedBrands;
