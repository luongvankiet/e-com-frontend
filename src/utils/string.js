export const slice = (string, limit = 200) =>
  string.length > limit ? `${string.slice(0, limit)}...` : string;

export const isValidEmail = (email) => {
  const regex =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

  return regex.test(email);
};

export const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || '';

export const isValidMobile = (mobile) => {
  mobile = mobile.replace(/-|\s/g, '');
  const regex = /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;

  return regex.test(mobile);
};

export const isValidPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-=_+{}[\]|\\;:'",.<>/?]).{8,}$/;
  return regex.test(password);
};

export const priceFormat = (price) => new Intl.NumberFormat().format(price);

export const urlWithQueryString = (url, queryFilters) => {
  if (!queryFilters) {
    return url;
  }

  let queryStringArray = Object.keys(queryFilters).map((queryName) => {
    if (
      queryFilters[queryName] === undefined ||
      queryFilters[queryName] === null ||
      queryFilters[queryName] === ''
    ) {
      return '';
    }
    return `${queryName}=${encodeURI(queryFilters[queryName])}`;
  });

  queryStringArray = queryStringArray.filter((queryString) => !!queryString);

  if (queryStringArray.length > 0) {
    const queryString = queryStringArray.join('&');

    url += (url.includes('?') ? '&' : '?') + queryString;
  }

  return url;
};

export const replaceId = (url, id) => url.replace(/:id/gi, id?.toString());

export const formatAddress = (addressLine1, addressLine2, city, state, postcode, country) => {
  const address = [];
  if (addressLine1) {
    address.push(addressLine1);
  }
  if (addressLine2) {
    address.push(`${addressLine2},`);
  }
  if (city) {
    address.push(`${city},`);
  }
  if (state) {
    address.push(state);
  }
  if (postcode) {
    address.push(`${postcode},`);
  }
  if (country) {
    address.push(country);
  }
  return address.join(' ');
};

export const snakeToTitle = (snakeStr) =>
  snakeStr
    .split('_')
    .map((word) => capitalize(word))
    .join(' ');
