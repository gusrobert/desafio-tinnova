/**
 * Base API client for making HTTP requests
 */
export class ApiClient {
  /**
   * Make a GET request
   * @param url The URL to request
   * @returns The response data
   */
  static async get<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`GET request failed: ${url}`, error);
      throw error;
    }
  }

  /**
   * Make a POST request
   */
  static async post<T>(url: string, data: any): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`POST request failed: ${url}`, error);
      throw error;
    }
  }

  /**
   * Make a PUT request
   * @param url The URL to request
   * @param data The data to send
   * @returns The response data
   */
  static async put<T>(url: string, data: any): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`PUT request failed: ${url}`, error);
      throw error;
    }
  }

  /**
   * Make a DELETE request
   * @param url The URL to request
   * @returns Void as DELETE operations typically don't return data
   */
  static async delete(url: string): Promise<void> {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      // Não fazemos retorno de corpo para DELETE, pois geralmente não retorna dados
      // Se a API retornar dados, você pode adicionar return await response.json();
    } catch (error) {
      console.error(`DELETE request failed: ${url}`, error);
      throw error;
    }
  }
}
