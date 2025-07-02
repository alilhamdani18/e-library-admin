// src/services/bookService.js
import api from '../configs/api';

export const bookService = {
  // GET All Books
  getAllBooks: async () => {
    try {
      const response = await api.get('/api/books');
      return response.data.data; 
    } catch (error) {
      console.error('Error fetching books:', error);
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

  createBook: async (bookData) => { 
    try {
      const response = await api.post('/api/books', bookData, { 
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  },

  updateBook: async (id, bookData) => { 
    try {
      const response = await api.put(`/api/books/${id}`, bookData, { 
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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