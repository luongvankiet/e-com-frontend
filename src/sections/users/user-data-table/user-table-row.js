import React, { useContext } from 'react';
import { usePopover } from 'src/components/custom-popover';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {
  TableRow,
  TableCell,
  Checkbox,
  Button,
  Avatar,
  ListItemText,
  Link,
  Tooltip,
  IconButton,
} from '@mui/material';
import { format } from 'date-fns';
import Label from 'src/components/label';
import { AuthContext } from 'src/auth/context';
import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';
import { replaceId } from 'src/utils/string';
import { Iconify } from 'src/components/iconify';

export default function UserDataTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { id, first_name, last_name, phone_number, email, role, email_verified_at, updated_at } =
    row;

  const { hasPermissions } = useContext(AuthContext);

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={first_name + last_name} sx={{ mr: 2 }} />

          <ListItemText
            primary={
              <Link
                component={RouterLink}
                href={replaceId(paths.dashboard.users.edit, id)}
                sx={{ color: 'text.secondary' }}
              >
                {first_name} {last_name}
              </Link>
            }
            secondary={email}
            primaryTypographyProps={{ typography: 'subtitle1' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phone_number}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {hasPermissions('roles.view') ? (
            <Link component={RouterLink} href={replaceId(paths.dashboard.settings.roles.edit)}>
              {role?.display_name || '--'}
            </Link>
          ) : (
            role?.display_name || '--'
          )}
        </TableCell>

        <TableCell>
          <Label variant="soft" color={(!!email_verified_at && 'success') || 'default'}>
            {email_verified_at ? 'Verified' : 'Pending'}
          </Label>
        </TableCell>

        <TableCell>
          <ListItemText
            primary={format(new Date(updated_at), 'dd MMM yyyy')}
            secondary={format(new Date(updated_at), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
