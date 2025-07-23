import api from '../configs/api';

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

      if (librarianData.profilePhotoFile) { 
        const formData = new FormData();
        formData.append("name", librarianData.name);
        formData.append("email", librarianData.email);
        formData.append("phone", librarianData.phone);
        formData.append("address", librarianData.address || '');
        formData.append("role", librarianData.role || ''); 
        
        formData.append("profileImage", librarianData.profilePhotoFile); 

        response = await api.put(`/api/librarian/profile/${librarianId}`, formData, { 
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        const jsonData = {
          name: librarianData.name || '',
          email: librarianData.email,
          phone: librarianData.phone || '',
          address: librarianData.address || '',
          role: librarianData.role || '',
        };
        response = await api.put(`/api/librarian/profile/${librarianId}`, jsonData); 
      }

      return response.data;
    } catch (error) {
      console.error(`Error updating profile with id ${librarianId}:`, error);
      throw error;
    }
  },



}