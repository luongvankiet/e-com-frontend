import {
  Box,
  Button,
  Checkbox,
  IconButton,
  LinearProgress,
  Link,
  ListItemText,
  MenuItem,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import { format, isBefore } from 'date-fns';
import React from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import Image from 'src/components/image';
import Label from 'src/components/label';
import { RouterLink } from 'src/components/router-link';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/paths';
import { fCurrency } from 'src/utils/format-number';
import { replaceId } from 'src/utils/string';

const ProductTableRow = ({
  product,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onRestoreRow,
  onRefresh,
}) => {
  const {
    name,
    sku,
    slug,
    price,
    discount_price,
    brand,
    featured_image,
    quantity = 0,
    status_label,
    status_color,
    deleted_at,
    published_at,
    updated_at,
  } = product;

  const confirm = useBoolean();

  const confirmRestore = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
          <Image
            alt={name}
            src={featured_image?.url}
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              mr: 2,
            }}
            variant="rounded"
            ratio="1/1"
          />

          <ListItemText
            disableTypography
            primary={
              <Link
                component={RouterLink}
                href={replaceId(paths.dashboard.products.view, slug)}
                sx={{ color: 'text.secondary', typography: 'subtitle1' }}
              >
                {name}
              </Link>
            }
            secondary={
              <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
                {brand?.name || ''}
              </Box>
            }
          />
        </TableCell>

        <TableCell>{sku || '--'}</TableCell>

        <TableCell sx={{ typography: 'caption', color: 'text.secondary' }}>
          <LinearProgress
            value={quantity}
            variant="determinate"
            color={(quantity <= 0 && 'error') || 'success'}
            sx={{ mb: 1, height: 6, maxWidth: 80 }}
          />
          {!!quantity && quantity} {quantity <= 0 ? 'Out of Stock' : 'In Stock'}
        </TableCell>

        <TableCell>
          <ListItemText
            primary={discount_price ? fCurrency(discount_price) : fCurrency(price)}
            secondary={discount_price && fCurrency(price)}
            primaryTypographyProps={{ typography: 'body1' }}
            secondaryTypographyProps={{
              sx: { textDecoration: 'line-through' },
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label variant="soft" color={status_color}>
            {status_label}
          </Label>
        </TableCell>

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
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
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
        content="Are you sure want to delete products?"
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
        content="Are you sure want to restore products?"
        action={
          <Button variant="contained" color="success" onClick={onRestoreRow}>
            Restore
          </Button>
        }
      />
    </>
  );
};

export default ProductTableRow;
