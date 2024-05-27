import { Box } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthGuard, PermissionBasedGuard } from 'src/auth/guard';
import { Main, Sidebar } from './components';
import Header from './components/header';

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AuthGuard>
      <PermissionBasedGuard permissions={['dashboard.view']} sx={{ pt: 20 }}>
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
      </PermissionBasedGuard>
    </AuthGuard>
  );
};

export default DashboardLayout;
