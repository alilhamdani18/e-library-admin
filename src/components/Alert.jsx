// components/Alert.js
import Swal from 'sweetalert2';

const customClass = {
  confirmButton: 'bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded mr-2',
  cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded',
};

const Alert = {
  success: (title = 'Berhasil!', text = '') => {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      timer: 2000,
      showConfirmButton: false,
      customClass,
      buttonsStyling: false,
    });
  },

  error: (title = 'Gagal!', text = '') => {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: 'Oke',
      customClass,
      buttonsStyling: false,
    });
  },

  warning: (title = 'Peringatan!', text = '') => {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonText: 'Oke',
      customClass,
      buttonsStyling: false,
    });
  },

  confirm: (
    title = 'Apakah Anda Yakin?',
    text = '',
    confirmText = 'Ya',
    cancelText = 'Batal'
  ) => {
    return Swal.fire({
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      customClass,
      buttonsStyling: false,
    });
  },

  confirmWithTextarea: (
    title = 'Apakah Anda Yakin?',
    text = '',
    confirmText = 'Ya',
    cancelText = 'Batal',
    placeholder = 'Masukkan alasan di sini...'
  ) => {
    return Swal.fire({
      icon: 'question',
      title,
      text,
      input: 'textarea',
      inputPlaceholder: placeholder,
      inputAttributes: {
        'aria-label': placeholder,
      },
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      customClass,
      buttonsStyling: false,
      inputValidator: (value) => {
      if (!value || value.trim() === '') {
        return 'Mohon isi alasan terlebih dahulu.';
      }
    },
    });
  }
};

export default Alert;
