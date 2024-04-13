import { Box } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthGuard } from 'src/auth/guard';
import { Main, Sidebar } from './components';
import Header from './components/header';
// import SerialNumberService from 'src/services/serial-number-service';
// import OrderService from 'src/services/order-service';
// import CategoryService from 'src/services/category-service';

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AuthGuard>
        <Header onOpenNav={() => setIsOpen(true)} />
        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Sidebar openNav={isOpen} onCloseNav={() => setIsOpen(false)} />
          <Main>
            <Outlet context={{}} />
          </Main>
        </Box>
      </AuthGuard>
  );
};

export default DashboardLayout;
