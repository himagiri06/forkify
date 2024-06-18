import { API_TIMEOUT_SECONDS } from './config';
import { timeout } from './helpers';

class AJAX {
  #headers = {
    'Content-Type': 'application/json',
  };

  /**
   * Creates
   * @param {string} url
   * @param {Object} payload
   * @returns
   */
  async create(url, payload) {
    const request = fetch(url, {
      method: 'POST',
      headers: this.#headers,
      body: JSON.stringify(payload),
    });
    return this.#fetchRequest(request, { payload, method: 'post' });
  }

  async read(url) {
    const request = fetch(url);
    return this.#fetchRequest(request);
  }

  async delete(url) {
    const request = fetch(url, { method: 'DELETE' });
    return this.#fetchRequest(request, { method: 'delete' });
  }

  async #fetchRequest(request, options = {}) {
    const { method = 'GET' } = options;

    try {
      const res = await Promise.race([request, timeout(API_TIMEOUT_SECONDS)]);
      let data;
      if (method?.trim().toLowerCase() !== 'delete') data = await res.json();
      if (!res.ok) throw new Error(`${data.message} (${res.status})`);
      if (method?.trim().toLowerCase() !== 'delete') return data;
    } catch (err) {
      throw err;
    }
  }
}

export const ajax = new AJAX();
