/* eslint-disable import/prefer-default-export */
import axios from 'axios';

export function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post('/news/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
