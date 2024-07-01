import { Box, Card, Typography } from '@mui/material';
import React from 'react';
import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel';
import Image from 'src/components/image';

const ProductShopCategories = ({ categories = [] }) => {
  const carousel = useCarousel({
    slidesToShow: 5,
    centerMode: true,
    centerPadding: '70px',
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
    <Box sx={{ overflow: 'hidden', position: 'relative' }}>
      <CarouselArrows filled shape="rounded" onNext={carousel.onNext} onPrev={carousel.onPrev}>
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {categories.map((category, index) => (
            <Box key={index} sx={{ px: 1 }}>
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
                  sx={{ mx: 'auto', width: 85, borderRadius: 100 }}
                  ratio="1/1"
                />

                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  {category.name}
                </Typography>
              </Card>
            </Box>
          ))}
        </Carousel>
      </CarouselArrows>
    </Box>
  );
};

export default ProductShopCategories;
