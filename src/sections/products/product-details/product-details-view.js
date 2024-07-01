import { Box, Button, Card, Tab, Tabs, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useCallback, useState } from 'react';
import EmptyContent from 'src/components/empty-content';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';

import Grid from '@mui/material/Unstable_Grid2';
import Markdown from 'src/components/markdown';
import ProductDetailsCarousel from './product-details-carousel';
import ProductDetailsSummary from './product-details-summary';
import { ProductDetailsSkeleton } from '../product-skeleton';
import ProductDetailsReview from './product-details-review';

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    title: '100% Original',
    description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
    icon: 'solar:verified-check-bold',
  },
  {
    title: '10 Day Replacement',
    description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
    icon: 'solar:clock-circle-bold',
  },
  {
    title: 'Year Warranty',
    description: 'Cotton candy gingerbread cake I love sugar sweet.',
    icon: 'solar:shield-check-bold',
  },
];

// ----------------------------------------------------------------------

const ProductDetailsView = ({ product, productLoading, productError }) => {
  const [currentTab, setCurrentTab] = useState('description');

  const [publish, setPublish] = useState('');

  const handleChangePublish = useCallback((newValue) => {}, []);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const renderSkeleton = <ProductDetailsSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${productError?.message || 'Product Not Found!'}`}
      action={
        <Button
          component={RouterLink}
          href={paths.dashboard.products.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Back to List
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderProduct = (
    <>
      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel images={product.images} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          <ProductDetailsSummary disabledActions product={product} />
        </Grid>
      </Grid>

      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        sx={{ my: 10 }}
      >
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main' }} />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Card>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {[
            {
              value: 'description',
              label: 'Description',
            },
            {
              value: 'reviews',
              label: `Reviews (${product.reviews_count})`,
            },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {currentTab === 'description' && (
          <Markdown
            children={product?.description}
            sx={{
              p: 3,
              '& p, li, ol': {
                typography: 'body2',
              },
              '& ol': {
                p: 0,
                display: { md: 'flex' },
                listStyleType: 'none',
                '& li': {
                  '&:first-of-type': {
                    minWidth: 240,
                    mb: { xs: 0.5, md: 0 },
                  },
                },
              },
            }}
          />
        )}

        {currentTab === 'reviews' && (
          <ProductDetailsReview
            ratings={product.ratings}
            reviews={product.reviews}
            totalRatings={product.ratings}
            totalReviews={product.reviews_count}
          />
        )}
      </Card>
    </>
  );

  return (
    <>
      {productLoading && renderSkeleton}

      {productError && renderError}

      {product && renderProduct}
    </>
  );
};

export default ProductDetailsView;
