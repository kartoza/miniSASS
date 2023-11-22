import axios, { AxiosResponse, Method } from 'axios';


export const handleSectionNavigation = (id: string) => {
  const element = document.getElementById(id);
  const offset = 45;
  const bodyRect = document.body.getBoundingClientRect().top;
  const elementRect = element?.getBoundingClientRect().top ?? 0;
  const elementPosition = elementRect - bodyRect;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

const currentURL = window.location.href;
const parts = currentURL.split('/');
const baseUrl = parts[0] + '//' + parts[2];
const staticPath = baseUrl + '/static/images/';

export const globalVariables = {
  currentURL,
  baseUrl,
  staticPath,
};

export const apiCall = async <T>(
  method: Method,
  url: string,
  data?: any
): Promise<AxiosResponse<T>> => {
  try {
    const response = await axios({ method, url, data });
    return response;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

