import {
  Button,
  Card,
  IconButton,
  Tab,
  Table,
  TableBody,
  TableContainer,
  Tabs,
  Tooltip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { isEqual } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  TableSkeleton,
  useTable,
} from 'src/components/table';
import { useRouter } from 'src/hooks/routes';
import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
import { paths } from 'src/paths';
import { BrandService } from 'src/services/brand-service';
import { replaceId } from 'src/utils/string';
import BrandTableFiltersResult from './brand-table-filters-result';
import BrandTableRow from './brand-table-row';
import BrandTableToolbar from './brand-table-toolbar';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'trashed', label: 'Trashed' },
];

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description', width: 480 },
  { id: 'publish', label: 'Publish' },
  { id: 'modified', label: 'Modified' },
  { id: '', width: 88 },
];

const defaultFilters = {
  search: '',
  status: 'all',
};

const BrandDataTable = () => {
  const table = useTable();

  const confirm = useBoolean();
  const confirmRestore = useBoolean();

  const router = useRouter();

  const [filters, setFilters] = useState(defaultFilters);

  const [page, setPage] = useState(0);

  const [perPage, setPerPage] = useState(10);

  const refreshList = useBoolean();

  const debouncedFilters = useDebounce({
    ...filters,
    page: page + 1,
    perPage,
    refreshList: refreshList.value,
  });

  const { brands, brandsTotal, brandsLoading, brandsEmpty } =
    BrandService.useGetBrandList(debouncedFilters);

  const { brandsStatus } = BrandService.useGetBrandStatusCount();

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDelete = useCallback(
    async (ids) => {
      try {
        if (debouncedFilters.status === 'trashed') {
          await BrandService.permanentDeleteMany(ids);
        } else {
          await BrandService.deleteMany(ids);
        }

        refreshList.onToggle();
        enqueueSnackbar('Delete Successfully!', { variant: 'success' });
        table.setSelected([]);

        if (confirm) {
          confirm.onFalse();
        }
      } catch (error) {
        enqueueSnackbar('Failed to delete!', { variant: 'error' });
        console.error(error);
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedFilters.status, table]
  );

  const handleRestore = useCallback(
    async (ids) => {
      try {
        await BrandService.restoreMany(ids);
        refreshList.onToggle();
        enqueueSnackbar('Restore Successfully!', { variant: 'success' });
        table.setSelected([]);

        if (confirmRestore) {
          confirmRestore.onFalse();
        }
      } catch (error) {
        enqueueSnackbar('Failed to restore!', { variant: 'error' });
        console.error(error);
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(replaceId(paths.dashboard.brands.edit, id));
    },
    [router]
  );

  useEffect(() => {
    table.setSelected([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedFilters.status,
    debouncedFilters.search,
    debouncedFilters.page,
    debouncedFilters.perPage,
    debouncedFilters.refreshList,
  ]);

  return (
    <>
      <Card>
        <Tabs
          value={filters.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                  }
                  color={
                    (tab.value === 'published' && 'success') ||
                    (tab.value === 'draft' && 'warning') ||
                    (tab.value === 'trashed' && 'error') ||
                    'default'
                  }
                >
                  {tab.value === 'all' && brandsStatus.total}
                  {tab.value === 'draft' && brandsStatus.draft_count}
                  {tab.value === 'published' && brandsStatus.published_count}
                  {tab.value === 'trashed' && brandsStatus.trashed_count}
                </Label>
              }
            />
          ))}
        </Tabs>

        <BrandTableToolbar filters={filters} onFilters={handleFilters} />

        {canReset && (
          <BrandTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={brandsTotal}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={brandsTotal}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                brands.map((row) => row.id)
              )
            }
            action={
              <>
                {debouncedFilters.status === 'trashed' && (
                  <Tooltip title="Restore">
                    <IconButton color="primary" onClick={confirmRestore.onTrue}>
                      <Iconify icon="material-symbols:settings-backup-restore-rounded" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip
                  title={debouncedFilters.status === 'trashed' ? 'Permanent Delete' : 'Delete'}
                >
                  <IconButton color="error" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              </>
            }
          />

          <Scrollbar sx={{ maxHeight: { lg: '600px', xl: '800px' } }}>
            <Table size={table.dense ? 'small' : 'medium'} stickyHeader>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={brandsTotal}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    brands.map((row) => row.id)
                  )
                }
              />
              <TableBody>
                {brandsLoading ? (
                  [...Array(table.rowsPerPage)].map((i, index) => (
                    <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  ))
                ) : (
                  <>
                    {brands.map((brand) => (
                      <BrandTableRow
                        key={brand.id}
                        brand={brand}
                        selected={table.selected.includes(brand.id)}
                        onSelectRow={() => table.onSelectRow(brand.id)}
                        onEditRow={() => handleEditRow(brand.id)}
                        onDeleteRow={() => handleDelete([brand.id])}
                        onRestoreRow={() => handleRestore([brand.id])}
                        onRefresh={() => refreshList.onToggle()}
                      />
                    ))}
                    {brandsEmpty && <TableNoData notFound={brandsEmpty} />}
                  </>
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={brandsTotal}
          page={page}
          rowsPerPage={perPage}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => setPerPage(event.target.value)}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete brands?"
        action={
          <Button variant="contained" color="error" onClick={() => handleDelete(table.selected)}>
            Delete
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmRestore.value}
        onClose={confirmRestore.onFalse}
        title="Restore"
        content="Are you sure want to restore brands?"
        action={
          <Button variant="contained" color="success" onClick={() => handleRestore(table.selected)}>
            Restore
          </Button>
        }
      />
    </>
  );
};

export default BrandDataTable;
