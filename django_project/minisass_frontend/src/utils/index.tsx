import React from 'react';
import axios from 'axios';


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

export const checkAuthStatus = async () => {
  try {
    const storedState = localStorage.getItem('authState');
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      const accessToken = parsedState.userData.access_token;

      const response = await axios.get(`${globalVariables.baseUrl}/authentication/api/check-auth-status/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    
    const { is_authenticated, username, email } = response.data;

    if (is_authenticated === 'true') {
      return true
    }
    }
  } catch (error) {
    console.error('Check auth status error:', error);
    return false
  }
  return false
};

