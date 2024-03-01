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
const docsPath = baseUrl + '/static/docs/';
let checkIsLand = false;

export const globalVariables = {
  currentURL,
  baseUrl,
  staticPath,
  docsPath,
  checkIsLand
};

/**
 * Capitalize string
 */
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Get title from string
 */
export function getTitle(key: string) {
  return  key.split('_')
    .map((part) => capitalize(part))
    .join(' ').trim()
}

/** Format date */
export function formatDate(d, reverseDate = false) {
  let month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;
  if (reverseDate) {
    return [day, month, year].join('-');
  } else {
    return [year, month, day].join('-');
  }
}

/**
 * Set local storage with expiration
 * @param key local storage key
 * @param value local storage value
 * @param ttl max age
 */
export function setLocalStorageWithExpiry(key, value, ttl) {
  const now = new Date()

  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  }
  localStorage.setItem(key, JSON.stringify(item))
}

/**
 * Get local storage and check its expiration
 * @param key local storage key
 */
export function getLocalStorageWithExpiry(key) {
  const itemStr = localStorage.getItem(key)

  // if the item doesn't exist, return null
  if (!itemStr) {
    return null
  }

  const item = JSON.parse(itemStr)
  const now = new Date()

  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(key)
    return null
  }
  return item.value
}

