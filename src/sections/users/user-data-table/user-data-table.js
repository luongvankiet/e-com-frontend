import {
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
import { useCallback, useState } from 'react';
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
import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
import { RoleService } from 'src/services/role-service';
import { UserService } from 'src/services/user-service';
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

  const { status } = UserService.useGetUserStatusCount();

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
      } catch (error) {
        enqueueSnackbar('Failed to delete!', { variant: 'error' });
        console.error(error);
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedFilters.status, table]
  );

  return (
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
                {tab.value === 'all' && status.total}
                {tab.value === 'verified' && status.verified_count}
                {tab.value === 'pending' && status.pending_count}
                {tab.value === 'trashed' && status.trashed_count}
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
            <Tooltip title="Delete">
              <IconButton color="primary" onClick={confirm.onTrue}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
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
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDelete([row.id])}
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
      />
    </Card>
  );
};

export default UserDataTable;
