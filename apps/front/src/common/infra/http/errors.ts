import axios from 'axios';

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(', ');
    }

    if (typeof message === 'string') {
      return message;
    }

    return 'Unexpected server error';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
};
