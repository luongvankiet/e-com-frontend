import { useMemo } from 'react';
import { api } from 'src/paths';
import axios, { fetcher } from 'src/utils/axios';
import { urlWithQueryString } from 'src/utils/string';
import useSWR from 'swr';

export const BrandService = {
  useGetBrandList: (queryFilters) => {
    const URL = api.brands.list;

    const { data, isLoading, error } = useSWR(urlWithQueryString(URL, queryFilters), fetcher);

    const memoizedValue = useMemo(
      () => ({
        brands: data?.data || [],
        brandsTotal: data?.meta?.total || 0,
        brandsLoading: isLoading,
        brandsError: error,
        brandsEmpty: !isLoading && !data?.data?.length,
      }),
      [data?.data, data?.meta?.total, error, isLoading]
    );

    return memoizedValue;
  },

  useGetBrandDetail: (id) => {
    const URL = api.brands.detail(id);

    const { data, isLoading, error } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
      () => ({
        brand: data?.data || [],
        brandLoading: isLoading,
        brandError: error,
      }),
      [data?.data, error, isLoading]
    );

    return memoizedValue;
  },

  useGetBrandStatusCount: () => {
    const URL = api.brands.statusCount;

    const { data, error } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
      () => ({
        brandsStatus: data?.data || [],
        brandsStatusError: error,
      }),
      [data?.data, error]
    );

    return memoizedValue;
  },

  createBrand: (body) => axios.post(api.brands.create, body),

  updateBrand: (id, body) => axios.post(api.brands.update(id), body),

  deleteMany: (ids) => axios.post(api.brands.deleteMany, { brand_ids: ids }),

  permanentDeleteMany: (ids) => axios.post(api.brands.permanentDeleteMany, { brand_ids: ids }),

  restoreMany: (ids) => axios.post(api.brands.restoreMany, { brand_ids: ids }),
};
