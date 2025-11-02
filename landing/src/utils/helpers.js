/**
 * helpers.js
 * Generic helper/utility functions
 */

/**
 * Get query parameters from URL
 * @returns {object} - Query parameters as object
 * 
 * @example
 * // URL: http://example.com?status=approved&id=123
 * getQueryParams() // { status: 'approved', id: '123' }
 */
export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};

  for (const [key, value] of params.entries()) {
    result[key] = value;
  }

  return result;
};

/**
 * Set query parameters in URL
 * @param {object} params - Parameters to set
 * @param {boolean} replace - Replace history instead of push
 */
export const setQueryParams = (params, replace = false) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.set(key, value);
    }
  });

  const newUrl = `${window.location.pathname}?${searchParams.toString()}`;

  if (replace) {
    window.history.replaceState({}, '', newUrl);
  } else {
    window.history.pushState({}, '', newUrl);
  }
};

/**
 * Deep clone an object
 * @param {object} obj - Object to clone
 * @returns {object} - Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * Merge objects (shallow merge)
 * @param {...objects} objects - Objects to merge
 * @returns {object} - Merged object
 */
export const mergeObjects = (...objects) => {
  return objects.reduce((result, obj) => {
    return { ...result, ...obj };
  }, {});
};

/**
 * Check if object is empty
 * @param {object} obj - Object to check
 * @returns {boolean}
 */
export const isObjectEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Sleep/delay execution
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise}
 * 
 * @example
 * await sleep(1000); // Wait 1 second
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delay - Initial delay in ms
 * @returns {Promise}
 */
export const retry = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        await sleep(delay * Math.pow(2, attempt));
      }
    }
  }

  throw lastError;
};

/**
 * Generate unique ID
 * @param {string} prefix - Prefix for ID
 * @returns {string} - Unique ID
 * 
 * @example
 * generateUID('USER') // 'USER_1730516040145_xyz123'
 */
export const generateUID = (prefix = '') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
};

/**
 * Chunk array into smaller arrays
 * @param {array} array - Array to chunk
 * @param {number} size - Chunk size
 * @returns {array} - Array of chunks
 * 
 * @example
 * chunkArray([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 */
export const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Remove duplicates from array
 * @param {array} array - Array with potential duplicates
 * @param {string} key - Key to check for duplicates (for objects)
 * @returns {array} - Array with duplicates removed
 */
export const removeDuplicates = (array, key = null) => {
  if (!key) {
    return [...new Set(array)];
  }

  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Sort array of objects by key
 * @param {array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {array} - Sorted array
 */
export const sortByKey = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Group array of objects by key
 * @param {array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {object} - Grouped object
 * 
 * @example
 * groupByKey([{status: 'active', id: 1}, {status: 'inactive', id: 2}], 'status')
 * // { active: [{status: 'active', id: 1}], inactive: [{status: 'inactive', id: 2}] }
 */
export const groupByKey = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Find object in array by condition
 * @param {array} array - Array to search
 * @param {Function} condition - Condition function
 * @returns {*} - Found item or undefined
 */
export const findByCondition = (array, condition) => {
  return array.find(item => condition(item));
};

/**
 * Filter and map in one operation
 * @param {array} array - Array to filter and map
 * @param {Function} fn - Function that returns value or null
 * @returns {array} - Filtered and mapped array
 */
export const filterMap = (array, fn) => {
  return array.map(fn).filter(item => item !== null && item !== undefined);
};

/**
 * Download data as JSON file
 * @param {*} data - Data to download
 * @param {string} filename - Filename
 */
export const downloadJSON = (data, filename = 'data.json') => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success or failure
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Throttle function calls
 * @param {Function} fn - Function to throttle
 * @param {number} delay - Delay in ms
 * @returns {Function} - Throttled function
 */
export const throttle = (fn, delay) => {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
};

/**
 * Debounce function calls
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} - Debounced function
 */
export const debounce = (fn, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export default {
  getQueryParams,
  setQueryParams,
  deepClone,
  sleep,
  retry,
  generateUID,
  chunkArray,
  removeDuplicates,
  sortByKey,
  groupByKey,
  findByCondition,
  filterMap,
  downloadJSON,
  copyToClipboard,
  throttle,
  debounce,
};
