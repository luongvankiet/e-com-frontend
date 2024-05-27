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
import { CategoryService } from 'src/services/category-service';
import { replaceId } from 'src/utils/string';
import CategoryTableFiltersResult from './category-table-filters-result';
import CategoryTableRow from './category-table-row';
import CategoryTableToolbar from './category-table-toolbar';

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

const CategoryDataTable = () => {
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

  const { categories, categoriesTotal, categoriesLoading, categoriesEmpty } =
    CategoryService.useGetCategoryList(debouncedFilters);

  const { categoriesStatus } = CategoryService.useGetCategoryStatusCount();

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
          await CategoryService.permanentDeleteMany(ids);
        } else {
          await CategoryService.deleteMany(ids);
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
        await CategoryService.restoreMany(ids);
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
      router.push(replaceId(paths.dashboard.categories.edit, id));
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
                  {tab.value === 'all' && categoriesStatus.total}
                  {tab.value === 'draft' && categoriesStatus.draft_count}
                  {tab.value === 'published' && categoriesStatus.published_count}
                  {tab.value === 'trashed' && categoriesStatus.trashed_count}
                </Label>
              }
            />
          ))}
        </Tabs>

        <CategoryTableToolbar filters={filters} onFilters={handleFilters} />

        {canReset && (
          <CategoryTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={categoriesTotal}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={categoriesTotal}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                categories.map((row) => row.id)
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
                rowCount={categoriesTotal}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    categories.map((row) => row.id)
                  )
                }
              />
              <TableBody>
                {categoriesLoading ? (
                  [...Array(table.rowsPerPage)].map((i, index) => (
                    <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  ))
                ) : (
                  <>
                    {categories.map((category) => (
                      <CategoryTableRow
                        key={category.id}
                        category={category}
                        selected={table.selected.includes(category.id)}
                        onSelectRow={() => table.onSelectRow(category.id)}
                        onEditRow={() => handleEditRow(category.id)}
                        onDeleteRow={() => handleDelete([category.id])}
                        onRestoreRow={() => handleRestore([category.id])}
                        onRefresh={() => refreshList.onToggle()}
                      />
                    ))}
                    {categoriesEmpty && <TableNoData notFound={categoriesEmpty} />}
                  </>
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={categoriesTotal}
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
        content="Are you sure want to delete categories?"
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
        content="Are you sure want to restore categories?"
        action={
          <Button variant="contained" color="success" onClick={() => handleRestore(table.selected)}>
            Restore
          </Button>
        }
      />
    </>
  );
};

export default CategoryDataTable;
