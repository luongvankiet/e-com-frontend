import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  ListItemText,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import React from 'react';
import Carousel, { CarouselDots, useCarousel } from 'src/components/carousel';
import { m } from 'framer-motion';

import Image from 'src/components/image';
import { useTheme } from '@emotion/react';
import { MotionViewport, varFade } from 'src/components/animate';

import { _ecommerceNewProducts } from 'src/_mock';
import ProductService from 'src/services/product-service';

const HomeNewProducts = () => {
  const { products, productLoading, setProductQueryFilters, refreshProductList } =
    ProductService.useGetProductList({ perPage: 5, featured: true });

  const carousel = useCarousel({
    speed: 1000,
    autoplay: true,
    ...CarouselDots({
      sx: {
        right: 20,
        bottom: 20,
        position: 'absolute',
        color: 'primary.light',
      },
    }),
  });

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          textAlign: 'center',
          mb: { xs: 5, md: 10 },
        }}
      >
        <m.div variants={varFade().inDown}>
          <Typography variant="h2">What do we offer?</Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Card>
            <Carousel {...carousel.carouselSettings}>
              {products.map((item) => (
                <CarouselItem key={item.id} item={item} />
              ))}
            </Carousel>
          </Card>
        </m.div>
      </Stack>
    </Container>
  );
};

export default HomeNewProducts;

function CarouselItem({ item }) {
  const theme = useTheme();

  const { images, name, description } = item;

  const renderImg = (
    <Image
      alt={name}
      src={images?.find((image) => !!image.is_featured)?.url}
      overlay={`linear-gradient(to bottom, ${alpha(theme.palette.grey[900], 0)} 0%, ${
        theme.palette.grey[900]
      } 75%)`}
      sx={{
        width: 1,
        height: { xs: 560, md: 660 },
      }}
    />
  );

  return (
    <Box sx={{ position: 'relative' }}>
      <CardContent
        sx={{
          left: 0,
          width: 1,
          bottom: 0,
          zIndex: 9,
          textAlign: 'left',
          position: 'absolute',
          color: 'common.white',
        }}
      >
        <Typography variant="overline" sx={{ opacity: 0.48 }}>
          New
        </Typography>

        <ListItemText
          sx={{ mt: 1, mb: 3 }}
          disableTypography
          primary={
            <Typography noWrap variant="h5">
              {name}
            </Typography>
          }
          secondary={
            <Typography noWrap variant="body2">
              {name}
            </Typography>
          }
        />

        <Typography variant="overline" sx={{ opacity: 0.48 }} />

        <Button color="primary" variant="contained">
          Buy Now
        </Button>
      </CardContent>

      {renderImg}
    </Box>
  );
}

CarouselItem.propTypes = {
  item: PropTypes.object,
};
