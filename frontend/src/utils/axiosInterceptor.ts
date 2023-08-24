import axios from 'axios';
import Cookies from 'js-cookie';

const userNoExist = 'Користувач, якому належить цей токен, більше не існує.';
const userRecentlyChangedPassword =
  'Користувач нещодавно змінив пароль! Будь ласка, увійдіть знову.';
const userNotLoggedIn =
  'Ви не авторизовані! Будь ласка, увійдіть, щоб отримати доступ.';

const cookieName = import.meta.env.VITE_AUTH_NAME;

const logout = async () => {
  await axios.post('/api/v1/users/logout');
  Cookies.remove(cookieName);
  window.location.href = '/';
};

export const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    function (response) {
      // Do something with response data
      return response;
    },
    function (error) {
      const message = error.response?.data?.message;
      const status = error.response?.status;

      if (status === 401) {
        // Logout if user does not exist or recently changed password
        if (message === userNoExist || message === userRecentlyChangedPassword)
          logout();

        // Logout if token is expired
        if (message === userNotLoggedIn) Cookies.remove(cookieName);
      }
      return Promise.reject(error);
    }
  );
};