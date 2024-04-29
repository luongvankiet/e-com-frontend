import { m } from 'framer-motion';
import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// assets
import { ForbiddenIllustration } from 'src/assets/illustrations';
// components
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { MotionContainer, varBounce } from 'src/components/animate';
import { AuthContext } from '../context';

// ----------------------------------------------------------------------

export function PermissionBasedGuard({ permissions, sx }) {
  // Logic here to get current user role
  const { hasPermissions } = useContext(AuthContext);

  if (typeof permissions !== 'undefined' && !!permissions.length && !hasPermissions(permissions)) {
    return (
      <Container component={MotionContainer} sx={{ m: 'auto', textAlign: 'center', ...sx }}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Permission Denied
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            You do not have permission to access this page
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>
      </Container>
    );
  }

  return <Outlet />;
}

PermissionBasedGuard.propTypes = {
  permissions: PropTypes.arrayOf(PropTypes.string),
  sx: PropTypes.object,
};
