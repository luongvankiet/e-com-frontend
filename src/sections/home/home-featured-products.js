import { Box, Button, Card, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { alpha } from '@mui/material/styles';
import { m } from 'framer-motion';
import { MotionViewport, varFade } from 'src/components/animate';
import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel';
import { Iconify } from 'src/components/iconify';
import Image from 'src/components/image';
import { RouterLink } from 'src/components/router-link';
import { TextMaxLine } from 'src/components/text-max-line';
import { paths } from 'src/paths';
import { ProductService } from 'src/services/product-service';
import ProductItem from '../products/product-shop/product-shop-list-item';

const HomeFeaturedProducts = () => {
  const { products, productsTotal } = ProductService.useGetProductList({ perPage: 10 });

  const carousel = useCarousel({
    slidesToShow: 3,
    centerMode: true,
    centerPadding: '60px',
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, centerPadding: '0' },
      },
    ],
  });

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: 5,
      }}
    >
      <m.div variants={varFade().inDown}>
        <Stack spacing={3} sx={{ mb: 5 }}>
          <m.div variants={varFade().inUp}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h3">Featured Products</Typography>
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

          <m.div variants={varFade().inDown}>
            <Box
              sx={{
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <CarouselArrows
                filled
                shape="rounded"
                onNext={carousel.onNext}
                onPrev={carousel.onPrev}
              >
                <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
                  {products.map((product, index) => (
                    <Box key={index} sx={{ px: 1 }}>
                      <ProductItem product={product} />
                    </Box>
                  ))}
                </Carousel>
              </CarouselArrows>
            </Box>
          </m.div>

          {productsTotal > 4 && (
            <m.div variants={varFade().in}>
              <Box
                gap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: `repeat(2, 1fr)`,
                }}
                sx={{ mt: 2 }}
              >
                <Card
                  sx={{
                    textAlign: 'center',
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.04),
                    p: (theme) => theme.spacing(5, 5),
                  }}
                >
                  <Image
                    src={products[0]?.featured_image?.url}
                    alt={products[0]?.name}
                    sx={{ mx: 'auto', borderRadius: 2 }}
                    ratio="1/1"
                  />

                  <Typography variant="h4" sx={{ mt: 4 }}>
                    {products[0]?.name}
                  </Typography>

                  <Typography variant="body1" sx={{ mt: 2 }}>
                    <TextMaxLine line={3}>{products[0]?.short_description}</TextMaxLine>
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

                <Stack spacing={3}>
                  {products.slice(1, 4).map((product, featuredProductIndex) => (
                    <Card
                      key={`featured-product-${product.name}-${featuredProductIndex}`}
                      sx={{
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.04),
                        p: (theme) => theme.spacing(5, 5),
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid xs={12} md={8}>
                          <Typography variant="h4">{product?.name}</Typography>

                          <Typography variant="body1" sx={{ mt: 2 }}>
                            <TextMaxLine line={3}>{product?.short_description}</TextMaxLine>
                          </Typography>

                          <Button
                            component={RouterLink}
                            href={paths.dashboard.products.create}
                            endIcon={<Iconify icon="icon-park-solid:right-one" />}
                            sx={{ mt: 2 }}
                          >
                            More Detail
                          </Button>
                        </Grid>

                        <Grid xs={12} md={4}>
                          <Image
                            src={product?.featured_image?.url}
                            alt={product?.name}
                            sx={{ mx: 'auto', width: 1, borderRadius: 2 }}
                            ratio="1/1"
                          />
                        </Grid>
                      </Grid>
                    </Card>
                  ))}
                </Stack>
              </Box>
            </m.div>
          )}
        </Stack>
      </m.div>
    </Container>
  );
};

export default HomeFeaturedProducts;
