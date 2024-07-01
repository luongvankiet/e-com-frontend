import { Box, Button, Divider, Link, Rating, Stack, ToggleButton, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { IncrementerButton } from 'src/components/incrementer-button';
import Label from 'src/components/label';
import { useRouter } from 'src/hooks/routes';
import { fCurrency, fShortenNumber } from 'src/utils/format-number';
import { RouterLink } from 'src/components/router-link';

const ProductDetailsSummary = ({
  cartItems,
  product,
  onAddCart,
  onGotoStep,
  disabledActions,
  ...other
}) => {
  const router = useRouter();

  const {
    id,
    name,
    options,
    price,
    discount_price,
    // newLabel,
    // saleLabel,
    quantity,
    short_description,
    // totalRatings,
    // totalReviews,
    status_label,
    status_color,
    product_variants,
    ratings,
    reviews_count,
    brand,
    published_at,
    deleted_at,
  } = product;

  const existProduct = !!cartItems?.length && cartItems.map((item) => item.id).includes(id);

  const isMaxQuantity =
    !!cartItems?.length &&
    cartItems.filter((item) => item.id === id).map((item) => item.quantity)[0] >= quantity;

  const renderPrice = (
    <Box sx={{ typography: 'h5' }}>
      {!!discount_price && (
        <Box
          component="span"
          sx={{
            color: 'text.disabled',
            textDecoration: 'line-through',
            mr: 0.5,
          }}
        >
          {fCurrency(discount_price)}
        </Box>
      )}

      {fCurrency(price)}
    </Box>
  );

  const renderBrand = brand && (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Brand:
      </Typography>
      <Link component={RouterLink}>
        <Typography variant="body1">{brand.name}</Typography>
      </Link>
    </Stack>
  );

  const renderShare = (
    <Stack direction="row" spacing={3} justifyContent="center">
      <Link
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Iconify icon="mingcute:add-line" width={16} sx={{ mr: 1 }} />
        Compare
      </Link>

      <Link
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Iconify icon="solar:heart-bold" width={16} sx={{ mr: 1 }} />
        Favorite
      </Link>

      <Link
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Iconify icon="solar:share-bold" width={16} sx={{ mr: 1 }} />
        Share
      </Link>
    </Stack>
  );

  const renderOptions =
    !!options?.length &&
    options.map((option, key) => (
      <Stack direction="row" justifyContent="space-between" key={`option-${key}`}>
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          {option.name}
        </Typography>

        <Stack
          direction="row"
          justifyContent="flex-end"
          useFlexGap
          flexWrap="wrap"
          spacing={1}
          sx={{ width: { xs: 600, md: 350 } }}
        >
          {option.values.map((value) => (
            <ToggleButton key={`option-value-${key}-${value.value}`} sx={{ py: 0.7 }} size="medium">
              {value.value}
            </ToggleButton>
          ))}
        </Stack>
      </Stack>
    ));

  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Quantity
      </Typography>

      <Stack spacing={1}>
        <IncrementerButton
          name="quantity"
          // quantity={values.quantity}
          // disabledDecrease={values.quantity <= 1}
          // disabledIncrease={values.quantity >= available}
          // onIncrease={() => setValue('quantity', values.quantity + 1)}
          // onDecrease={() => setValue('quantity', values.quantity - 1)}
        />

        <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
          Available: {quantity}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderActions = (
    <Stack direction="row" spacing={2}>
      <Button
        fullWidth
        disabled={isMaxQuantity || disabledActions}
        size="large"
        color="warning"
        variant="contained"
        startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
        // onClick={handleAddCart}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Add to Cart
      </Button>

      <Button fullWidth size="large" type="submit" variant="contained" disabled={disabledActions}>
        Buy Now
      </Button>
    </Stack>
  );

  const renderShortDescription = (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {short_description}
    </Typography>
  );

  const renderRating = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        color: 'text.disabled',
        typography: 'body2',
      }}
    >
      <Rating size="small" value={ratings} precision={0.1} readOnly sx={{ mr: 1 }} />
      {`(${fShortenNumber(reviews_count)} reviews)`}
    </Stack>
  );

  const renderLabels = (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Label color={status_color}>{status_label}</Label>
    </Stack>
  );

  return (
    <Stack spacing={3} sx={{ pt: 3 }} {...other}>
      <Stack spacing={2} alignItems="flex-start">
        {renderLabels}

        {/* {renderInventoryType} */}

        <Typography variant="h5">{name}</Typography>

        {renderRating}

        {renderPrice}

        {renderShortDescription}
      </Stack>

      {renderBrand}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderOptions}

      {renderQuantity}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderActions}

      {renderShare}
    </Stack>
  );
};

export default ProductDetailsSummary;
