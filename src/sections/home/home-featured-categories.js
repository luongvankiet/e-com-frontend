import { Box, Button, Card, Container, Link, Stack, Typography } from '@mui/material';
import { m } from 'framer-motion';

import Grid from '@mui/material/Unstable_Grid2';
import { MotionViewport, varFade } from 'src/components/animate';
import { Iconify } from 'src/components/iconify';
import Image from 'src/components/image/image';
import { RouterLink } from 'src/components/router-link';
import { TextMaxLine } from 'src/components/text-max-line';
import { paths } from 'src/paths';
import { CategoryService } from 'src/services/category-service';

const HomeFeaturedCategories = () => {
  const { categories } = CategoryService.useGetCategoryList({ perPage: 5 });

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: 5,
      }}
    >
      <m.div variants={varFade().inUp}>
        <Stack
          spacing={3}
          sx={{
            mb: 5,
          }}
        >
          <m.div variants={varFade().inUp}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h3">Categories</Typography>
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

          <Grid container spacing={2}>
            <Grid xs={12} md={4}>
              {categories[0] && (
                <m.div variants={varFade().inUp} key={categories[0].name}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      bgcolor: 'background.default',
                      p: (theme) => theme.spacing(5, 5),
                    }}
                  >
                    <Image
                      src={categories[0].image?.url}
                      alt={categories[0].name}
                      sx={{ mx: 'auto', width: 180, borderRadius: 5 }}
                      ratio="1/1"
                    />

                    <Typography variant="h4" sx={{ mt: 4 }}>
                      {categories[0].name}
                    </Typography>

                    <Typography variant="body1" sx={{ mt: 2 }}>
                      <TextMaxLine line={4}>{categories[0].description}</TextMaxLine>
                    </Typography>

                    <Button
                      component={RouterLink}
                      href={paths.dashboard.products.create}
                      endIcon={<Iconify icon="icon-park-solid:right-one" />}
                      sx={{ mt: 2 }}
                    >
                      More Detail
                    </Button>
                  </Card>
                </m.div>
              )}
            </Grid>

            <Grid xs={12} md={8}>
              <Box
                gap={2}
                display="grid"
                alignItems="center"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: `repeat(2, 1fr)`,
                }}
              >
                {categories.slice(1, 5).map((category, index) => (
                  <m.div variants={varFade().inUp} key={`${category.name}-${index}`}>
                    <Link component={RouterLink} href="/">
                      <Card
                        sx={{
                          p: 4,
                          '&:hover': {
                            color: 'text.secondary',
                            textDecoration: 'none',
                          },
                        }}
                      >
                        <Stack direction="row" spacing={3} alignItems="center">
                          <Image
                            src={category.image?.url}
                            alt={category.name}
                            sx={{ width: 130, borderRadius: 5 }}
                            ratio="1/1"
                          />

                          <Stack spacing={0.5}>
                            <Typography variant="h4">{category.name}</Typography>

                            <Typography variant="body1">
                              <TextMaxLine line={4}>{category.description}</TextMaxLine>
                            </Typography>
                          </Stack>
                        </Stack>
                      </Card>
                    </Link>
                  </m.div>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </m.div>
    </Container>
  );
};

export default HomeFeaturedCategories;
