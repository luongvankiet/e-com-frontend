import { useMemo } from 'react';
import { api } from 'src/paths';
import axios, { fetcher } from 'src/utils/axios';
import { urlWithQueryString } from 'src/utils/string';
import useSWR from 'swr';

export const CategoryService = {
  useGetCategoryList: (queryFilters) => {
    const URL = api.categories.list;

    const { data, isLoading, error } = useSWR(urlWithQueryString(URL, queryFilters), fetcher);

    const memoizedValue = useMemo(
      () => ({
        categories: data?.data || [],
        categoriesTotal: data?.meta?.total || 0,
        categoriesLoading: isLoading,
        categoriesError: error,
        categoriesEmpty: !isLoading && !data?.data?.length,
      }),
      [data?.data, data?.meta?.total, error, isLoading]
    );

    return memoizedValue;
  },

  useGetCategoryDetail: (id) => {
    const URL = api.categories.detail(id);

    const { data, isLoading, error } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
      () => ({
        category: data?.data || [],
        categoryLoading: isLoading,
        categoryError: error,
      }),
      [data?.data, error, isLoading]
    );

    return memoizedValue;
  },

  useGetCategoryStatusCount: () => {
    const URL = api.categories.statusCount;

    const { data, error } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
      () => ({
        categoriesStatus: data?.data || [],
        categoriesStatusError: error,
      }),
      [data?.data, error]
    );

    return memoizedValue;
  },

  createCategory: (body) => axios.post(api.categories.create, body),

  updateCategory: (id, body) => axios.put(api.categories.update(id), body),

  deleteMany: (ids) => axios.post(api.categories.deleteMany, { category_ids: ids }),

  permanentDeleteMany: (ids) =>
    axios.post(api.categories.permanentDeleteMany, { category_ids: ids }),

  restoreMany: (ids) => axios.post(api.categories.restoreMany, { category_ids: ids }),
};
