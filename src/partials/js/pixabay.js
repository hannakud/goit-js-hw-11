import axios from 'axios';

const API_KEY = '34267718-575dae68b3f1b9c8f0d64e611';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export function fetchArticles(q, page) {
  return axios.get('', {
    params: {
      q,
      page,
      per_page: 40,
      key: API_KEY,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  });
}
