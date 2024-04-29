import useSWR from 'swr';
import { api } from 'src/paths';
import { urlWithQueryString } from 'src/utils/string';
import axios, { fetcher } from 'src/utils/axios';
import { useMemo } from 'react';

export const UserService = {
  useGetUserList: (queryFilters) => {
    const URL = api.users.list;

    const { data, isLoading, error } = useSWR(urlWithQueryString(URL, queryFilters), fetcher);

    const memorizedValue = useMemo(
      () => ({
        users: data?.data || [],
        usersTotal: data?.meta?.total || 0,
        usersLoading: isLoading,
        usersError: error,
        usersEmpty: !isLoading && !data?.data?.length,
      }),
      [data?.data, data?.meta?.total, error, isLoading]
    );

    return memorizedValue;
  },

  useGetUserStatusCount: () => {
    const URL = api.users.statusCount;

    const { data, error } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
      () => ({
        status: data?.data || [],
        statusError: error,
      }),
      [data?.data, error]
    );

    return memoizedValue;
  },

  deleteOne: (id) => axios.delete(api.users.deleteOne(id)),

  deleteMany: (ids) => axios.post(api.users.deleteMany, { user_ids: ids }),

  permanentDeleteMany: (ids) => axios.post(api.users.permanentDeleteMany, { user_ids: ids }),

  restoreMany: (ids) => axios.post(api.users.restoreMany, { user_ids: ids }),
};
