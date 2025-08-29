import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

export const PROVIDER_GET = async (pathUrl: string) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(`${BASE_URL}/${pathUrl}`, {
      headers,
    });

    switch (response.status) {
      case 200:
      case 201:
        return { data: response.data, statusNumber: response.status };
      default:
        throw new Error("error");
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorResponse = err.response;
      if (errorResponse) {
        switch (errorResponse.status) {
          case 400:
            throw errorResponse;
          case 401:
            throw errorResponse;
          case 403:
            throw errorResponse;
          case 404:
            throw errorResponse;
          default:
            throw new Error("error");
        }
      }
    }

    throw err;
  }
};

export const PROVIDER_POST = async (
  pathUrl: string,
  data: object | FormData,
  type = "object"
) => {
  const headers = {
    "Content-Type":
      type == "object" ? "application/json" : "multipart/form-data",
  };

  try {
    const response = await axios.post(`${BASE_URL}/${pathUrl}`, data, {
      headers,
    });
    switch (response.status) {
      case 200:
      case 201:
        return { ...response.data, statusNumber: response.status };
      default:
        throw new Error("error");
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorResponse = err.response;
      if (errorResponse) {
        switch (errorResponse.status) {
          case 400:
            throw errorResponse;
          case 401:
            throw errorResponse;
          case 403:
            throw errorResponse;
          case 404:
            throw errorResponse;
          default:
            throw new Error("error");
        }
      }
    }

    throw err;
  }
};

export const PROVIDER_DELETE = async (pathUrl: string) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.delete(`${BASE_URL}/${pathUrl}`, {
      headers,
    });

    switch (response.status) {
      case 200:
        return { ...response.data, statusNumber: response.status };
      case 201:
        return { ...response.data, statusNumber: response.status };
      default:
        throw new Error("error");
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorResponse = err.response;
      if (errorResponse) {
        switch (errorResponse.status) {
          case 401:
            throw errorResponse;
          case 403:
            throw errorResponse;
          case 404:
            throw errorResponse;
          default:
            throw new Error("error");
        }
      }
    }
    throw err;
  }
};

export const PROVIDER_PUT = async (
  pathUrl: string,
  data: object | FormData,
  type = "object"
) => {
  const headers = {
    "Content-Type":
      type == "object" ? "application/json" : "multipart/form-data",
  };

  try {
    const response = await axios.put(`${BASE_URL}/${pathUrl}`, data, {
      headers,
    });

    switch (response.status) {
      case 200:
      case 201:
        return { ...response.data, statusNumber: response.status };
      default:
        throw new Error("error");
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorResponse = err.response;
      if (errorResponse) {
        switch (errorResponse.status) {
          case 401:
            throw errorResponse;
          case 403:
            throw errorResponse;
          case 404:
            throw errorResponse;
          default:
            throw new Error("error");
        }
      }
    }
    throw err;
  }
};

export const PROVIDER_PATCH = async (
  pathUrl: string,
  data: object | FormData,
  type = "object"
) => {
  const headers = {
    "Content-Type":
      type == "object" ? "application/json" : "multipart/form-data",
  };

  try {
    const response = await axios.patch(`${BASE_URL}/${pathUrl}`, data, {
      headers,
    });

    switch (response.status) {
      case 200:
      case 201:
        return { ...response.data, statusNumber: response.status };
      default:
        throw new Error("error");
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorResponse = err.response;
      if (errorResponse) {
        switch (errorResponse.status) {
          case 401:
            throw errorResponse;
          case 403:
            throw errorResponse;
          case 404:
            throw errorResponse;
          default:
            throw new Error("error");
        }
      }
    }
    throw err;
  }
};