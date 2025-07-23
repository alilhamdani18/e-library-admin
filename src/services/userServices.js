// src/services/userService.js
import api from '../configs/api';

export const userService = {
  // registerUser: async (userData) => {
  //   try {
  //     const response = await api.post('/api/users/register', userData);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error registering user:', error);
  //     throw error;
  //   }
  // },

  // GET All Users
  getAllUsers: async () => {
    try {
      const response = await api.get('/api/users');
      const allUser = response.data.data;

      const filteredUsers = allUser.filter(user => user.role !== 'librarian');
      return filteredUsers;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // GET User by ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/api/users/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with id ${userId}:`, error);
      throw error;
    }
  }
};