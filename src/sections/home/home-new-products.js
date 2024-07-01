import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  ListItemText,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { MotionViewport, varFade } from 'src/components/animate';
import Carousel, { CarouselDots, useCarousel } from 'src/components/carousel';
import Image from 'src/components/image';
import Label from 'src/components/label';
import { ProductService } from 'src/services/product-service';

const HomeNewProducts = () => {
  const { products } = ProductService.useGetProductList({perPage: 5});

  const carousel = useCarousel({
    speed: 1000,
    autoplaySpeed: 4000,
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
        py: 5,
      }}
    >
      <m.div variants={varFade().inUp}>
        <Card>
          <Carousel {...carousel.carouselSettings}>
            {products.map((product) => (
              <CarouselItem key={product.id} item={product} />
            ))}
          </Carousel>
        </Card>
      </m.div>
    </Container>
  );
};

export default HomeNewProducts;

function CarouselItem({ item }) {
  const theme = useTheme();

  const { featured_image, name, short_description } = item;

  const renderImg = (
    <Image
      alt={name}
      src={featured_image?.url}
      overlay={`linear-gradient(to bottom, ${alpha(theme.palette.grey[500], 0)} 0%, ${
        theme.palette.grey[500]
      } 95%)`}
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
        <Label color="secondary" variant="filled">
          New
        </Label>
        {/* <Typography variant="overline" sx={{ opacity: 0.48 }}>
          New
        </Typography> */}

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
              {short_description}
            </Typography>
          }
        />

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
