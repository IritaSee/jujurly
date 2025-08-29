export const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
};

export const convertDateString = (isoString: string): string => {
  const tanggal = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  return tanggal.toLocaleDateString("en-US", options);
};

export const updateToastConfig = (
  message: string,
  type: "success" | "error"
) => {
  return {
    render: message,
    type: type,
    isLoading: false,
    autoClose: 3000,
  };
};
