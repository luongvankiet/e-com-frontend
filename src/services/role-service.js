import { useMemo } from 'react';
import { api } from 'src/paths';
import axios, { fetcher } from 'src/utils/axios';
import { urlWithQueryString } from 'src/utils/string';
import useSWR from 'swr';

export const RoleService = {
  useGetRoleList: (queryFilters) => {
    const URL = api.roles.list;

    const { data, isLoading, error } = useSWR(urlWithQueryString(URL, queryFilters), fetcher);

    const memorizedValue = useMemo(
      () => ({
        roles: data?.data || [],
        rolesTotal: data?.meta?.total || 0,
        rolesLoading: isLoading,
        rolesError: error,
        rolesEmpty: !isLoading && !data?.data?.length,
      }),
      [data?.data, data?.meta?.total, error, isLoading]
    );

    return memorizedValue;
  },

  useGetRoleDetail: (id) => {
    const URL = api.roles.detail(id);

    const { data, isLoading, error } = useSWR(URL, fetcher);

    const memorizedValue = useMemo(
      () => ({
        role: data?.data || [],
        roleLoading: isLoading,
        roleError: error,
      }),
      [data?.data, error, isLoading]
    );

    return memorizedValue;
  },

  createRole: (body) => axios.post(api.roles.create, body),

  updateRole: (id, body) => axios.put(api.roles.update(id), body),

  deleteMany: (ids) => axios.post(api.roles.deleteMany, { role_ids: ids }),
};
