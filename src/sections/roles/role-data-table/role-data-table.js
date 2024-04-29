import { Alert, Card, IconButton, Table, TableBody, TableContainer, Tooltip } from '@mui/material';
import { isEqual } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { Iconify } from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { TableNoData, TablePaginationCustom, TableSkeleton, useTable } from 'src/components/table';
import TableHeadCustom from 'src/components/table/table-head-custom';
import TableSelectedAction from 'src/components/table/table-selected-action';
import { useRouter } from 'src/hooks/routes';
import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
import { paths } from 'src/paths';
import { PermissionService } from 'src/services/permission-service';
import { RoleService } from 'src/services/role-service';
import { replaceId } from 'src/utils/string';
import RoleTableFilterResult from './role-table-filter-result';
import RoleTableRow from './role-table-row';
import RoleTableToolbar from './role-table-toolbar';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'modified', label: 'Modified' },
  { id: '', width: 88 },
];

const defaultFilters = {
  search: '',
};

const RoleDataTable = () => {
  const table = useTable();

  const confirm = useBoolean();

  const router = useRouter();

  const { permissions } = PermissionService.useGetPermissionList();

  const [filters, setFilters] = useState(defaultFilters);

  const [page, setPage] = useState(0);

  const [perPage, setPerPage] = useState(10);

  const refreshList = useBoolean();

  const [errorMessage, setErrorMessage] = useState('');

  const debouncedFilters = useDebounce({
    ...filters,
    page: page + 1,
    perPage,
    refreshList: refreshList.value,
  });

  const { roles, rolesTotal, rolesLoading, rolesEmpty } =
    RoleService.useGetRoleList(debouncedFilters);

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual({ search: defaultFilters.search }, { search: filters.search });

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

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDelete = useCallback(
    async (ids) => {
      try {
        await RoleService.deleteMany(ids);
        refreshList.onToggle();
        enqueueSnackbar('Delete Successfully!', { variant: 'success' });
        table.setSelected([]);
      } catch (error) {
        setErrorMessage(error || 'Failed to delete!');
        enqueueSnackbar('Failed to delete!', { variant: 'error' });
        console.error(error);
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(replaceId(paths.dashboard.settings.roles.edit, id));
    },
    [router]
  );

  return (
    <Card>
      {!!errorMessage && (
        <Alert sx={{ m: 2.5, mb: 0 }} severity="error" onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      <RoleTableToolbar filters={filters} onFilters={handleFilters} />

      {canReset && (
        <RoleTableFilterResult
          filters={filters}
          onFilters={handleFilters}
          onResetFilters={handleResetFilters}
          results={rolesTotal}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <TableContainer>
        <TableSelectedAction
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={rolesTotal}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              roles.map((row) => row.id)
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
              rowCount={rolesTotal}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  roles.map((row) => row.id)
                )
              }
            />
            <TableBody>
              {rolesLoading ? (
                [...Array(5)].map[
                  (i, index) => <TableSkeleton key={index} sx={{ height: denseHeight }} />
                ]
              ) : (
                <>
                  {roles.map((role) => (
                    <RoleTableRow
                      key={`role-row-${role.id}`}
                      role={role}
                      permissions={permissions}
                      selected={table.selected.includes(role.id)}
                      onSelectRow={() => table.onSelectRow(role.id)}
                      onEditRow={() => handleEditRow(role.id)}
                      onDeleteRow={() => handleDelete([role.id])}
                      onRefresh={() => refreshList.onToggle()}
                    />
                  ))}
                  {rolesEmpty && <TableNoData notFound={rolesEmpty} />}
                </>
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={rolesTotal}
        page={page}
        rowsPerPage={perPage}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => setPerPage(event.target.value)}
      />
    </Card>
  );
};

export default RoleDataTable;
