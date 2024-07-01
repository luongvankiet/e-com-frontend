import Pagination, { paginationClasses } from '@mui/material/Pagination';
import ProductReviewItem from './product-review-item';

const ProductReviewList = ({ reviews }) => (
  <>
    {reviews.map((review) => (
      <ProductReviewItem key={review.id} review={review} />
    ))}

    {reviews.map((review) => (
      <ProductReviewItem key={review.id} review={review} />
    ))}

    <Pagination
      count={10}
      sx={{
        mx: 'auto',
        [`& .${paginationClasses.ul}`]: {
          my: 5,
          mx: 'auto',
          justifyContent: 'center',
        },
      }}
    />
  </>
);

export default ProductReviewList;
