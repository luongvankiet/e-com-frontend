import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import { views } from 'src/paths';
import NavList from './nav-list';
//
// import NavList from './nav-list';

// ----------------------------------------------------------------------

export default function NavDesktop({ offsetTop }) {
  return (
    <Stack component="nav" direction="row" spacing={5} sx={{ mr: 2.5, height: 1 }}>
      {views.client.map((link, key) => (
        <NavList key={`${link.name}-${link.action}-${key}`} item={link} offsetTop={offsetTop} />
      ))}
    </Stack>
  );
}

NavDesktop.propTypes = {
  offsetTop: PropTypes.bool,
};
