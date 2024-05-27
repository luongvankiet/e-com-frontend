import { m } from 'framer-motion';
import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// assets
import { ForbiddenIllustration } from 'src/assets/illustrations';
// components
import { useContext } from 'react';
import { MotionContainer, varBounce } from 'src/components/animate';
import { AuthContext } from '../context';

// ----------------------------------------------------------------------

export default function PermissionBasedGuard({ children, permissions, onlySuperAdmin, sx }) {
  // Logic here to get current user role
  const { hasPermissions, isSuperAdmin } = useContext(AuthContext);

  if (
    (onlySuperAdmin && isSuperAdmin) ||
    (typeof permissions !== 'undefined' && !!permissions.length && !hasPermissions(permissions))
  ) {
    return (
      <Container component={MotionContainer} sx={{ m: 'auto', textAlign: 'center', ...sx }}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Permission Denied
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            You do not have permission to access this page or perform this action
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

  return <>{children}</>;
}

PermissionBasedGuard.propTypes = {
  permissions: PropTypes.arrayOf(PropTypes.string),
  sx: PropTypes.object,
};
