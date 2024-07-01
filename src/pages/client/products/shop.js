import { Box, Container, ListItemText, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/system';
import { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import { PROJECT_NAME } from 'src/config-global';
import { useDebounce } from 'src/hooks/use-debounce';
import { useResponsive } from 'src/hooks/use-responsive';
import ProductShopCategories from 'src/sections/products/product-shop/product-shop-categories';
import ProductShopList from 'src/sections/products/product-shop/product-shop-list';
import ProductShopSearch from 'src/sections/products/product-shop/product-shop-search';
import { CategoryService } from 'src/services/category-service';
import { ProductService } from 'src/services/product-service';

const defaultFilters = {
  gender: [],
  colors: [],
  rating: '',
  category: 'all',
  priceRange: [],
};

const Shop = () => {
  const settings = useSettingsContext();

  const mdUp = useResponsive('up', 'md');

  const { categories } = CategoryService.useGetCategoryList({ disabledPagination: false });

  const [filters, setFilters] = useState(defaultFilters);

  const debouncedFilterQuery = useDebounce(filters);

  const { products, productsLoading, productsEmpty } =
    ProductService.useGetProductList(debouncedFilterQuery);

  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery);

  const searchResults = ProductService.useGetProductList(debouncedSearchQuery);

  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);
  }, []);

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <ProductShopSearch
        query={debouncedSearchQuery}
        results={searchResults.products}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        loading={searchResults.productsLoading}
        hrefItem={(id) => {}}
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        {/* <ProductFilters
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          //
          filters={filters}
          onFilters={handleFilters}
          //
          canReset={canReset}
          onResetFilters={handleResetFilters}
          //
          colorOptions={PRODUCT_COLOR_OPTIONS}
          ratingOptions={PRODUCT_RATING_OPTIONS}
          genderOptions={PRODUCT_GENDER_OPTIONS}
          categoryOptions={['all', ...PRODUCT_CATEGORY_OPTIONS]}
        /> */}

        {/* <ProductSort sort={sortBy} onSort={handleSortBy} sortOptions={PRODUCT_SORT_OPTIONS} /> */}
      </Stack>
    </Stack>
  );

  const renderNotFound = <EmptyContent filled title="No Data" sx={{ py: 10 }} />;

  return (
    <>
      <Helmet>
        <title>Shop | {PROJECT_NAME}</title>
      </Helmet>

      {mdUp && (
        <Box
          sx={{
            py: 10,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          }}
        >
          <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <Stack spacing={5}>
              <ListItemText
                primary="Categories"
                secondary="Discover a selection of carefully curated looks inspired by the spirit of marathon"
                primaryTypographyProps={{ typography: 'h3' }}
                secondaryTypographyProps={{ typography: 'body1' }}
              />
              <ProductShopCategories categories={categories} />
            </Stack>
          </Container>
        </Box>
      )}

      <Container
        maxWidth={settings.themeStretch ? false : 'lg'}
        sx={{
          mb: 15,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            my: { xs: 3, md: 5 },
          }}
        >
          Shop
        </Typography>

        <Stack
          spacing={2.5}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {renderFilters}

          {/* {canReset && renderResults} */}
        </Stack>

        {productsEmpty && renderNotFound}

        <ProductShopList products={products} loading={productsLoading} />
      </Container>
    </>
  );
};

export default Shop;
