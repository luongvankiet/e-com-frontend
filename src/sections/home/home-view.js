import { Box } from '@mui/material';
import { useScroll } from 'framer-motion';
import ScrollProgress from 'src/components/scroll-progress';
import HomeHero from './home-hero';
import HomeNewProducts from './home-new-products';
import HomeFeaturedCategories from './home-featured-categories';
import HomeGuarantees from './home-guarantees';
import HomeFeaturedBrands from './home-featured-brands';
import HomeFeaturedProducts from './home-featured-products';

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
        <HomeGuarantees />

        <HomeNewProducts />

        <HomeFeaturedBrands />

        <HomeFeaturedCategories />

        <HomeFeaturedProducts />
      </Box>
    </>
  );
};

export default HomeView;
