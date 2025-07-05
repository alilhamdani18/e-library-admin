// src/services/bookService.js
import api from '../configs/api';

export const bookService = {
  // GET All Books
 getAllBooks: async (page = 1, limit = 12, category = '', search = '') => {
    try {
      const params = {
        page: page,
        limit: limit,
      };

      if (category) {
        params.category = category;
      }
      if (search) {
        params.search = search;
      }

      // Gunakan instance `api` Anda untuk melakukan request GET
      // Path '/books' diasumsikan sebagai endpoint relatif dari baseURL yang dikonfigurasi di `api`
      const response = await api.get('/api/books', { params });

      // <<< INI ADALAH BAGIAN KRUSIALNYA >>>
      // Data JSON yang Anda tunjukkan sebelumnya adalah `response.data` dari Axios.
      // Jadi, langsung kembalikan `response.data` ini.
      console.log("Response from API (full object):", response.data); // Ini akan mencetak JSON lengkap
      return response.data; // Ini mengembalikan { success: true, data: [...], pagination: {...} }

    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  },

  // GET Book by ID
  getBookById: async (id) => {
    try {
      const response = await api.get(`/api/books/${id}`);
      return response.data.data; 
    } catch (error) {
      console.error(`Error fetching book with id ${id}:`, error);
      throw error;
    }
  },

  createBook: async (bookData, onUploadProgressCallback) => { 
    try {
      const response = await api.post('/api/books', bookData, { 
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
        onUploadProgress: onUploadProgressCallback
      });
      console.log(response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  },

  updateBook: async (id, bookData, onUploadProgressCallback) => { 
    try {
      const response = await api.put(`/api/books/${id}`, bookData, { 
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onUploadProgressCallback

      });
      console.log(response.data);

      return response.data;
    } catch (error) {
      console.error(`Error updating book with id ${id}:`, error);
      throw error;
    }
  },

  // DELETE Book
  deleteBook: async (id) => {
    try {
      const response = await api.delete(`/api/books/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting book with id ${id}:`, error);
      throw error;
    }
  }
};