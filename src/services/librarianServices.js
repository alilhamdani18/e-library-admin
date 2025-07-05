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

      // Di sini, kita akan memeriksa apakah ada file foto baru (originalPhoto)
      // Perhatikan bahwa `librarianData` di sini akan menjadi objek yang kita kirimkan dari komponen
      // yang berisi data profil dan *mungkin* file foto baru
      if (librarianData.profilePhotoFile) { // Menggunakan nama field yang lebih spesifik untuk file
        // Jika ada file baru, kirim sebagai FormData
        const formData = new FormData();
        formData.append("name", librarianData.name);
        formData.append("email", librarianData.email);
        formData.append("phone", librarianData.phone);
        formData.append("address", librarianData.address || ''); // Tambahkan address jika ada di backend
        formData.append("role", librarianData.role || ''); // Tambahkan role jika ada di backend
        
        formData.append("profileImage", librarianData.profilePhotoFile); // <== nama field harus cocok dengan backend (misal: 'profilePhoto')

        response = await api.put(`/api/librarian/profile/${librarianId}`, formData, { // <== URL endpoint yang benar
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Jika tidak ada file baru, kirim sebagai JSON biasa
        const jsonData = {
          name: librarianData.name || '',
          email: librarianData.email,
          phone: librarianData.phone || '',
          address: librarianData.address || '',
          role: librarianData.role || '',
        };
        response = await api.put(`/api/librarian/profile/${librarianId}`, jsonData); // <== URL endpoint yang benar
      }

      return response.data;
    } catch (error) {
      console.error(`Error updating profile with id ${librarianId}:`, error);
      throw error;
    }
  },



}