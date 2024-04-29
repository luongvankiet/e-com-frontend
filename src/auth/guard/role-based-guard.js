import { m } from 'framer-motion';
import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// hooks
// assets
import { ForbiddenIllustration } from 'src/assets/illustrations';
// components
import { useContext } from 'react';
import { MotionContainer, varBounce } from 'src/components/animate';
import { AuthContext } from '../context';

// ----------------------------------------------------------------------

export default function RoleBasedGuard({ roles, children, sx }) {
  // Logic here to get current user role
  const { user, isSuperAdmin } = useContext(AuthContext);

  // const currentRole = 'user';
  const currentRole = user?.role; // admin;

  if (isSuperAdmin()) {
    return <>{children}</>;
  }

  if (typeof roles !== 'undefined' && !roles.includes(currentRole.name)) {
    return (
      <Container component={MotionContainer} sx={{ textAlign: 'center', ...sx }}>
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

  return <> {children} </>;
}

RoleBasedGuard.propTypes = {
  children: PropTypes.node,
  roles: PropTypes.arrayOf(PropTypes.string),
  sx: PropTypes.object,
};
