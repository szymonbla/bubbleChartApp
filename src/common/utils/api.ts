import axios from 'axios';

export const axiosRequest = axios.create({
  baseURL: 'https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/',
  headers: {
    'X-RapidAPI-Host': `${process.env.REACT_APP_X_RAPIDAPI_HOST}`,
    'X-RapidAPI-Key': `${process.env.REACT_APP_X_RAPIDAPI_KEY}`
  }
});
