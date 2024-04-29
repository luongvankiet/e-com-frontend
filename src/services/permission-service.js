import { useMemo } from 'react';
import { api } from 'src/paths';
import axios, { fetcher } from 'src/utils/axios';
import useSWR from 'swr';

export const PermissionService = {
  useGetPermissionList: () => {
    const URL = api.permissions.list;

    const { data, isLoading, error } = useSWR(URL, fetcher);

    const memorizedValue = useMemo(
      () => ({
        permissions: data?.data || [],
        permissionsLoading: isLoading,
        permissionsError: error,
      }),
      [data?.data, error, isLoading]
    );

    return memorizedValue;
  },

  createPermission: (body) => axios.post(api.permissions.create, body),

  updatePermission: (id, body) => axios.put(api.permissions.update(id), body),

  deletePermission: (id) => axios.delete(api.permissions.delete(id)),
};
