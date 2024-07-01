import { Box, Divider, Rating, Stack, Typography } from '@mui/material';
import React from 'react';
import { useBoolean } from 'src/hooks/use-boolean';
import { fShortenNumber } from 'src/utils/format-number';
import ProductReviewList from '../product-review/product-review-list';

const ProductDetailsReview = ({ ratings, reviews = [], totalReviews }) => {
  const review = useBoolean();

  const renderSummary = (
    <Stack spacing={1} alignItems="center" justifyContent="center">
      <Typography variant="subtitle2">Average rating</Typography>

      <Typography variant="h2">{ratings}/5</Typography>

      <Rating readOnly value={ratings} precision={0.1} />

      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        ({fShortenNumber(totalReviews)} reviews)
      </Typography>
    </Stack>
  );

  const renderProgress = (
    <Stack
      spacing={1.5}
      sx={{
        py: 5,
        px: { xs: 3, md: 5 },
        borderLeft: (theme) => ({
          md: `dashed 1px ${theme.palette.divider}`,
        }),
        borderRight: (theme) => ({
          md: `dashed 1px ${theme.palette.divider}`,
        }),
      }}
      alignItems="center"
    >
      {[...Array(5)].map((i, index) => (
        <Stack direction="row" alignItems="center">
          <Typography variant="subtitle2" component="span" sx={{ width: 42 }}>
            {5 - index} Star
          </Typography>

          <Rating
            readOnly
            value={5 - index}
            precision={0.1}
            sx={{
              mx: 4,
            }}
          />

          <Typography
            variant="body2"
            component="span"
            sx={{
              minWidth: 48,
              color: 'text.secondary',
            }}
          >
            {reviews.filter((r) => r.rating === 5 - index).length}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        sx={{
          py: 5,
        }}
      >
        {renderSummary}

        {renderProgress}

        {/* {renderReviewButton} */}
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <ProductReviewList reviews={reviews} />
    </>
  );
};

export default ProductDetailsReview;
