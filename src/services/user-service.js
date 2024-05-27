import useSWR from 'swr';
import { api } from 'src/paths';
import { urlWithQueryString } from 'src/utils/string';
import axios, { fetcher } from 'src/utils/axios';
import { useMemo } from 'react';

export const UserService = {
  useGetUserList: (queryFilters) => {
    const URL = api.users.list;

    const { data, isLoading, error } = useSWR(urlWithQueryString(URL, queryFilters), fetcher);

    const memoizedValue = useMemo(
      () => ({
        users: data?.data || [],
        usersTotal: data?.meta?.total || 0,
        usersLoading: isLoading,
        usersError: error,
        usersEmpty: !isLoading && !data?.data?.length,
      }),
      [data?.data, data?.meta?.total, error, isLoading]
    );

    return memoizedValue;
  },

  useGetUserStatusCount: () => {
    const URL = api.users.statusCount;

    const { data, error } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
      () => ({
        usersStatus: data?.data || [],
        usersStatusError: error,
      }),
      [data?.data, error]
    );

    return memoizedValue;
  },

  useGetUserDetail: (id) => {
    const URL = api.users.detail(id);

    const { data, isLoading, error } = useSWR(URL, fetcher);

    const memoizedValues = useMemo(
      () => ({
        user: data?.data,
        userLoading: isLoading,
        userError: error,
      }),
      [data?.data, error, isLoading]
    );

    return memoizedValues;
  },

  createUser: (body) => axios.post(api.users.create, body),

  updateUser: (id, body) =>
    axios.post(api.users.update(id), body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  deleteOne: (id) => axios.delete(api.users.deleteOne(id)),

  deleteMany: (ids) => axios.post(api.users.deleteMany, { user_ids: ids }),

  permanentDeleteMany: (ids) => axios.post(api.users.permanentDeleteMany, { user_ids: ids }),

  restoreMany: (ids) => axios.post(api.users.restoreMany, { user_ids: ids }),
};
