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
import Label from 'src/components/label/label';
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
import { RoleService } from 'src/services/role-service';
import { UserService } from 'src/services/user-service';
import { replaceId } from 'src/utils/string';
import UserTableFiltersResult from './user-table-filters-result';
import UserTableRow from './user-table-row';
import UserTableToolbar from './user-table-toolbar';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: 'trashed', label: 'Trashed' },
];

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'phone_number', label: 'Phone Number' },
  { id: 'role', label: 'Role' },
  { id: 'verified', label: 'Verified' },
  { id: 'modified', label: 'Modified' },
  { id: '', width: 88 },
];

const defaultFilters = {
  search: '',
  roles: [],
  status: 'all',
};

const UserDataTable = () => {
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

  const { users, usersTotal, usersLoading, usersEmpty } =
    UserService.useGetUserList(debouncedFilters);

  const { roles } = RoleService.useGetRoleList({ disabledPagination: true });

  const { usersStatus } = UserService.useGetUserStatusCount({
    refreshList: refreshList.value,
  });

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
          await UserService.permanentDeleteMany(ids);
        } else {
          await UserService.deleteMany(ids);
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
        await UserService.restoreMany(ids);
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
      router.push(replaceId(paths.dashboard.users.edit, id));
    },
    [router]
  );

  useEffect(() => {
    table.setSelected([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedFilters.status,
    debouncedFilters.roles,
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
                    (tab.value === 'verified' && 'success') ||
                    (tab.value === 'pending' && 'warning') ||
                    (tab.value === 'trashed' && 'error') ||
                    'default'
                  }
                >
                  {tab.value === 'all' && usersStatus.total}
                  {tab.value === 'verified' && usersStatus.verified_count}
                  {tab.value === 'pending' && usersStatus.pending_count}
                  {tab.value === 'trashed' && usersStatus.trashed_count}
                </Label>
              }
            />
          ))}
        </Tabs>

        <UserTableToolbar
          filters={filters}
          onFilters={handleFilters}
          //
          roleOptions={roles}
        />

        {canReset && (
          <UserTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={usersTotal}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={usersTotal}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                users.map((row) => row.id)
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
                rowCount={usersTotal}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    users.map((row) => row.id)
                  )
                }
              />
              <TableBody>
                {usersLoading ? (
                  [...Array(table.rowsPerPage)].map((i, index) => (
                    <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  ))
                ) : (
                  <>
                    {users.map((row) => (
                      <UserTableRow
                        key={row.id}
                        user={row}
                        roles={roles}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDelete([row.id])}
                        onRestoreRow={() => handleRestore([row.id])}
                        onRefresh={() => refreshList.onToggle()}
                      />
                    ))}
                    {usersEmpty && <TableNoData notFound={usersEmpty} />}
                  </>
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={usersTotal}
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
        content="Are you sure want to delete users?"
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
        content="Are you sure want to restore users?"
        action={
          <Button variant="contained" color="success" onClick={() => handleRestore(table.selected)}>
            Restore
          </Button>
        }
      />
    </>
  );
};

export default UserDataTable;
