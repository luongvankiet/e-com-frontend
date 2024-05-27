import { Box, Card, Container, Link, Stack, Typography } from '@mui/material';
import { m } from 'framer-motion';

import { MotionViewport, varFade } from 'src/components/animate';
import Image from 'src/components/image/image';
import { RouterLink } from 'src/components/router-link';
import { CategoryService } from 'src/services/category-service';

const HomeCategories = () => {
  const { categories, categoriesTotal } = CategoryService.useGetCategoryList({ perPage: 6 });

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: 10,
      }}
    >
      <m.div variants={varFade().inUp}>
        <Stack
          spacing={3}
          sx={{
            mb: { xs: 5, md: 10 },
          }}
        >
          <m.div variants={varFade().inDown}>
            <Typography variant="h3">Categories</Typography>
          </m.div>

          <Box
            gap={3}
            display="grid"
            alignItems="center"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              md: `repeat(${categoriesTotal}, 1fr)`,
            }}
          >
            {categories.map((category, index) => (
              <m.div variants={varFade().inUp} key={`${category.name}-${index}`}>
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
                      src={category.image?.url}
                      alt={category.name}
                      sx={{ mx: 'auto', width: 100, borderRadius: 1.5 }}
                      ratio="1/1"
                    />
                    {/* <Box
                    component="img"
                    src={brand.images[0]?.url}
                    alt={brand.name}
                    sx={{ mx: 'auto', width: 48, height: 48 }}
                  /> */}

                    <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>
                      {category.name}
                    </Typography>

                    {/* <Typography sx={{ color: 'text.secondary' }}>{brand.description}</Typography> */}
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

export default HomeCategories;
