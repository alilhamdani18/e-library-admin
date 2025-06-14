import api from '../configs/api';

export const loanServices = {
  getAllLoans: async () => {
    try {
      const response = await api.get('/api/loans');
      const allLoans = response.data.data;

      // Filter loans yang bukan 'pending'
      const filteredLoans = allLoans.filter(loan => loan.status !== 'pending');

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

      // Filter loans yang bukan 'pending'
      const filteredLoans = allLoans.filter(loan => loan.status == 'pending');

      return filteredLoans;
    } catch (error) {
      console.error('Error fetching loans:', error);
      throw error;
    }
  },


  approveLoan: async (loanId) => {
    try {
      const response = await api.put(`/api/loans/${loanId}/approve`);
      return response.data;
    } catch (error) {
      console.error(`Error approving loan with id ${loanId}:`, error);
      throw error;
    }
  },
  rejectLoan: async (loanId) => {
    try {
      const response = await api.put(`/api/loans/${loanId}/reject`);
      return response.data;
    } catch (error) {
      console.error(`Error rejecting loan with id ${loanId}:`, error);
      throw error;
    }
  },
  returnLoan: async (loanId) => {
    try {
      const response = await api.put(`/api/loans/${loanId}/return`);
      return response.data;
    } catch (error) {
      console.error(`Error returning book with id ${loanId}:`, error);
      throw error;
    }
  },
};