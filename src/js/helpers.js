import { API_TIMEOUT_SECONDS } from './config';

export const timeout = function (s) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(`Request took too long! Timeout after ${s} second`)), s * 1000));
};

// export const AJAX = async function (url, payload = null) {
//   try {
//     const request = payload
//       ? fetch(url, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(payload),
//         })
//       : fetch(url);

//     const res = await Promise.race([request, timeout(API_TIMEOUT_SECONDS)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const AJAXGet = async function (url) {
//   const request = fetch(url);
//   return fetchRequest(request);
// };
// export const AJAXPost = async function (url) {
//   const request = fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(payload),
//   });
//   return fetchRequest(request);
// };

// export const AJAXDelete = async function (url) {
//   const request = fetch(url, { method: 'DELETE' });
//   return fetchRequest(request, { method: 'DELETE' });
// };

// async function fetchRequest(request, options = {}) {
//   const { method } = options;
//   try {
//     const res = await Promise.race([request, timeout(API_TIMEOUT_SECONDS)]);
//     let data;
//     if (method?.trim().toLowerCase() !== 'delete') data = await res.json();
//     if (!res.ok) throw new Error(`${data ? data.message : ''} (${res.status})`);
//     return data;
//   } catch (error) {
//     throw error;
//   }
// }
// export const sendJSON = async function (url, payload) {
//   try {
//     const request = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(payload),
//     });
//     const res = await Promise.race([request, timeout(API_TIMEOUT_SECONDS)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
// export const getJSON = async function (url) {
//   try {
//     const res = await Promise.race([fetch(url), timeout(API_TIMEOUT_SECONDS)]);
//     const data = await res.json();
//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };

export const setLocalStorage = function (key, value) {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * gets the value from the local storage based on the key passed into the function
 * @param {string} keyName A string containing the name of the key you want to retrieve the value of.
 * @param {*} [defaultValue] this defaultValue value will be returned if no value found for the key. If no value passed, empty string will be used as the defaultValue
 * @returns {JSON} Parsed JSON is returned if value found otherwise the defaultValue
 */
export const getLocalStorage = function (keyName, defaultValue = '') {
  const storage = localStorage.getItem(keyName);
  if (storage) return JSON.parse(storage);
  return defaultValue;
};
