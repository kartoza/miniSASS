import axios, { AxiosResponse } from 'axios';
import React from 'react';


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
  method: string,
  url: string,
  data?: any
): Promise<AxiosResponse<T>> => {
  try {
    const validMethods = ['get', 'post', 'put', 'delete'];

    if (!validMethods.includes(method.toLowerCase())) {
      throw new Error('Invalid HTTP method');
    }

    const response = await axios({
      method: method.toLowerCase(),
      url,
      data,
    });

    return response;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

