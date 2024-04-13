import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { usePathname } from 'src/hooks/routes';
// import { useCallback, useEffect, useState } from 'react';
import Footer from './components/footer';
import Header from './components/header';

const ClientLayout = () => {
  const pathname = usePathname();

  const isHome = pathname === '/';

  // const [categories, setCategories] = useState([]);
  // const [categoriesLoading, setCategoriesLoading] = useState(false);
  // const { products, productLoading, productErrors, setProductQueryFilters } =
  //   ProductService.useGetProductList();

  const context = {
    // categories,
    // categoriesLoading,
    // productContext: { products, productLoading, productErrors, setProductQueryFilters },
  };

  // const getCategoryList = useCallback(async () => {
  //   setCategoriesLoading(true);
  //   try {
  //     const res = await CategoryService.getList({ onlyParent: true });
  //     setCategories(res.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   setCategoriesLoading(false);
  // }, []);

  // useEffect(() => {
  //   getCategoryList();
  // }, [getCategoryList]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
      <Header />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ...(!isHome && {
            pt: { xs: 8, md: 10 },
          }),
        }}
      >
        <Outlet context={context} />
      </Box>

      <Footer />
    </Box>
  );
};

export default ClientLayout;
