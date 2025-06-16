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
      return response.data;
    } catch (error) {
      console.error(`Error fetching book with id ${id}:`, error);
      throw error;
    }
  },

  // POST New Book
  createBook: async (bookData) => {
    try {
      const formData = new FormData();

      formData.append("title", bookData.title);
      formData.append("author", bookData.author);
      formData.append("year", bookData.year);
      formData.append("description", bookData.description);
      formData.append("category", bookData.category);
      formData.append("stock", bookData.stock);
      if (bookData.pages) {
        formData.append("pages", bookData.pages);
      }

      if (bookData.file) {
        formData.append("cover", bookData.file); // <== pastikan 'cover' sesuai dengan multer
      }


      const response = await api.post('/api/books', formData, {
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

  // PUT/Edit Book (with optional file upload)
  updateBook: async (id, bookData) => {
    try {
      let response;

      if (bookData.file) {
        // Jika ada file baru (cover), kirim sebagai FormData
        const formData = new FormData();
        formData.append("title", bookData.title);
        formData.append("author", bookData.author);
        formData.append("year", bookData.year);
        formData.append("description", bookData.description);
        formData.append("category", bookData.category);
        formData.append("stock", bookData.stock);
        formData.append("pages", bookData.pages);
        
        formData.append("cover", bookData.file); // <== nama field harus cocok dengan multer

        response = await api.put(`/api/books/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Jika tidak ada file baru, kirim sebagai JSON biasa
        const jsonData = {
          title: bookData.title,
          author: bookData.author,
          year: bookData.year,
          description: bookData.description,
          category: bookData.category,
          stock: bookData.stock,
          pages: bookData.pages,
        };

        response = await api.put(`/api/books/${id}`, jsonData);
      }

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
