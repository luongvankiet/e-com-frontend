import { Box } from '@mui/material';
import { useScroll } from 'framer-motion';
import ScrollProgress from 'src/components/scroll-progress';
import HomeHero from './home-hero';
import HomeProductsOnSale from './home-products-on-sale';
import HomeCategories from './home-categories';

const HomeView = () => {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <HomeHero />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <HomeProductsOnSale />

        <HomeCategories />
      </Box>
    </>
  );
};

export default HomeView;
