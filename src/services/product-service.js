import { useMemo } from 'react';
import { api } from 'src/paths';
import axios, { fetcher } from 'src/utils/axios';
import { urlWithQueryString } from 'src/utils/string';
import useSWR from 'swr';

export const ProductService = {
  useGetProductList: (queryFilters) => {
    const URL = api.products.list;

    const { data, isLoading, error } = useSWR(urlWithQueryString(URL, queryFilters), fetcher);

    const memoizedValue = useMemo(
      () => ({
        products: data?.data || [],
        productsTotal: data?.meta?.total || 0,
        productsLoading: isLoading,
        productsError: error,
        productsEmpty: !isLoading && !data?.data?.length,
      }),
      [data?.data, data?.meta?.total, error, isLoading]
    );

    return memoizedValue;
  },

  useGetProductDetail: (id) => {
    const URL = api.products.detail(id);

    const { data, isLoading, error } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
      () => ({
        product: data?.data || [],
        productLoading: isLoading,
        productError: error,
      }),
      [data?.data, error, isLoading]
    );

    return memoizedValue;
  },

  useGetProductStatusCount: () => {
    const URL = api.products.statusCount;

    const { data, error } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
      () => ({
        productsStatus: data?.data || [],
        productsStatusError: error,
      }),
      [data?.data, error]
    );

    return memoizedValue;
  },

  createProduct: (body) => axios.post(api.products.create, body),

  updateProduct: (id, body) => axios.put(api.products.update(id), body),

  deleteMany: (ids) => axios.post(api.products.deleteMany, { product_ids: ids }),

  permanentDeleteMany: (ids) => axios.post(api.products.permanentDeleteMany, { product_ids: ids }),

  restoreMany: (ids) => axios.post(api.products.restoreMany, { product_ids: ids }),
};
