import {
  Button,
  Checkbox,
  IconButton,
  Link,
  ListItemText,
  MenuItem,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import { format, isBefore } from 'date-fns';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import Label from 'src/components/label';
import { RouterLink } from 'src/components/router-link';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/paths';
import { replaceId } from 'src/utils/string';
import CategoryQuickEditForm from './category-quick-edit-form';

const CategoryTableRow = ({
  category,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onRestoreRow,
  onRefresh,
}) => {
  const { id, name, description, deleted_at, published_at, updated_at } = category;

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

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Link
            component={RouterLink}
            href={replaceId(paths.dashboard.categories.edit, id)}
            sx={{ color: 'text.secondary', typography: 'subtitle1' }}
          >
            {name}
          </Link>
        </TableCell>

        <TableCell>{description || '--'}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={
              (!deleted_at &&
                ((!published_at && 'primary') ||
                  (isBefore(new Date(published_at), new Date()) && 'success'))) ||
              'warning'
            }
          >
            {(!deleted_at &&
              ((!published_at && 'Draft') ||
                (isBefore(new Date(published_at), new Date()) && 'Published'))) ||
              'Trashed'}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={format(new Date(updated_at), 'dd MMM yyyy')}
            secondary={format(new Date(updated_at), 'p')}
            primaryTypographyProps={{ typography: 'body 2', noWrap: true }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
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

              <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
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

      <CategoryQuickEditForm
        category={category}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
        onDeleteRow={() => onDeleteRow(category.id)}
        onRefresh={onRefresh}
      />

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
        content="Are you sure want to delete categories?"
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
        content="Are you sure want to restore categories?"
        action={
          <Button variant="contained" color="success" onClick={onRestoreRow}>
            Restore
          </Button>
        }
      />
    </>
  );
};

export default CategoryTableRow;
