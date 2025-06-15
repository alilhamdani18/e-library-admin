import api from '../configs/api';
import { getAuth } from "firebase/auth";

export const librarianServices = {
  getDashboardStats: async () => {
    try {
      const response = await api.get('api/librarian/dashboard/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
  getLibrarianProfile: async (librarianId) => {
    try {
      const response = await api.get(`/api/librarian/profile/${librarianId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching librarian profile: ${librarianId}`, error);
      throw error;
    }
  },
  updateLibrarianProfile: async (librarianId, librarianData) => {
    try {
      let response;

      if (librarianData.file) {
        // Jika ada file baru (cover), kirim sebagai FormData
        const formData = new FormData();
        formData.append("name", librarianData.name);
        formData.append("email", librarianData.email);
        formData.append("phone", librarianData.phone);
        formData.append("bio", librarianData.bio);
        formData.append("address", librarianData.address);
        
        
        formData.append("cover", librarianData.file); // <== nama field harus cocok dengan multer

        response = await api.put(`/api/books/${librarianId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Jika tidak ada file baru, kirim sebagai JSON biasa
        const jsonData = {
          name: librarianData.name,
          email: librarianData.email,
          phone: librarianData.phone,
          bio: librarianData.bio,
          address: librarianData.address,
        };
        response = await api.put(`/api/librarians/profile/${librarianId}`, jsonData);
      }

      return response.data;
    } catch (error) {
      console.error(`Error updating profile with id ${librarianId}:`, error);
      throw error;
    }
  },


}