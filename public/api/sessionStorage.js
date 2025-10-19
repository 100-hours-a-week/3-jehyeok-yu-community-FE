const ACCESS_KEY = "AT";

export const saveToken = (t) => {
  if (t) sessionStorage.setItem(ACCESS_KEY, t);
  else sessionStorage.removeItem(ACCESS_KEY);
};

export const getAccessToken = () => {
  return sessionStorage.getItem(ACCESS_KEY);
};
