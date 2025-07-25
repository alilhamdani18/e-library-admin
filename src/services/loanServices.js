import api from '../configs/api';

export const loanServices = {
  getAllLoans: async () => {
    try {
      const response = await api.get('/api/loans');
      const allLoans = response.data.data;

      const filteredLoans = allLoans.filter(loan => loan.status !== 'pending' && loan.status !== 'rejected');

      return filteredLoans;
    } catch (error) {
      console.error('Error fetching loans:', error);
      throw error;
    }
  },
  getAllRequest: async () => {
    try {
      const response = await api.get('/api/loans');
      const allLoans = response.data.data;

      const filteredLoans = allLoans.filter(loan => loan.status == 'pending');

      return filteredLoans;
    } catch (error) {
      console.error('Error fetching loans:', error);
      throw error;
    }
  },


  approveLoan: async (loanId, librarianId) => {
    try {
      const response = await api.put(`/api/loans/${loanId}/approve`, {
        librarianId,
      });
      return response.data;
    } catch (error) {
      console.error(`Error approving loan with id ${loanId}:`, error);
      throw error;
    }
  },

  rejectLoan: async (loanId, librarianId, reason) => {
    try {
      const response = await api.put(`/api/loans/${loanId}/reject`, {
        librarianId, reason
      });
      return response.data;
    } catch (error) {
      console.error(`Error rejecting loan with id ${loanId}:`, error);
      throw error;
    }
  },
  returnLoan: async (loanId, librarianId) => {
    try {
      const response = await api.put(`/api/loans/${loanId}/return`, {
        librarianId
      });
      return response.data;
    } catch (error) {
      console.error(`Error returning book with id ${loanId}:`, error);
      throw error;
    }
  },
};