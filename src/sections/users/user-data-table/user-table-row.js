import React, { useContext } from 'react';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
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
  MenuItem,
} from '@mui/material';
import { format } from 'date-fns';
import Label from 'src/components/label';
import { AuthContext } from 'src/auth/context';
import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';
import { replaceId } from 'src/utils/string';
import { Iconify } from 'src/components/iconify';
import UserQuickEditForm from './user-quick-edit-form';

export default function UserDataTableRow({
  user,
  roles,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
  onRestoreRow,
  onRefresh,
}) {
  const {
    id,
    first_name,
    last_name,
    phone_number,
    email,
    role,
    image,
    email_verified_at,
    updated_at,
    deleted_at,
  } = user;

  const { hasPermissions } = useContext(AuthContext);

  const confirm = useBoolean();

  const confirmRestore = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={image?.alt_text} sx={{ mr: 2 }} src={image?.url} />

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
          {role && hasPermissions('roles.view') ? (
            <Link
              component={RouterLink}
              href={replaceId(paths.dashboard.settings.roles.edit, role.id)}
            >
              {role.display_name || '--'}
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

        <TableCell align="right" sx={{ px: 1 }}>
          {!deleted_at ? (
            <>
              <Tooltip title="Quick Edit" placement="top" arrow>
                <IconButton
                  color={quickEdit.value ? 'inherit' : 'default'}
                  onClick={quickEdit.onTrue}
                >
                  <Iconify icon="solar:pen-bold" />
                </IconButton>
              </Tooltip>

              <Tooltip title="More" placement="top" arrow>
                <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title="Restore" placement="top" arrow>
                <IconButton color="default" onClick={confirmRestore.onTrue}>
                  <Iconify icon="material-symbols:settings-backup-restore-rounded" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Permanent Delete" placement="top" arrow>
                <IconButton color="error" onClick={confirm.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </TableCell>
      </TableRow>

      <UserQuickEditForm
        user={user}
        roles={roles}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
        onDeleteRow={() => onDeleteRow(user.id)}
        onRefresh={onRefresh}
      />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete users?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmRestore.value}
        onClose={confirmRestore.onFalse}
        title="Restore"
        content="Are you sure want to restore users?"
        action={
          <Button variant="contained" color="success" onClick={onRestoreRow}>
            Restore
          </Button>
        }
      />
    </>
  );
}
