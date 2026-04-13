import Swal from 'sweetalert2'

/**
 * File Utilitas untuk menampilkan Pesan Alert (Notifikasi).
 * Menggunakan library SweetAlert2 agar tampilan pesan lebih menarik.
 */

/**
 * Menampilkan pesan sukses berwarna hijau.
 * @param {string} message - Isi pesan yang ingin ditampilkan.
 */
export function showSuccess(message) {
  Swal.fire({
    icon: 'success',
    title: 'Berhasil',
    text: message,
    timer: 2000,
    showConfirmButton: false
  })
}

/**
 * Menampilkan pesan sukses khusus untuk operasi Tambah, Edit, atau Hapus data (CRUD).
 * @param {string} action - Jenis aksi ('create', 'update', 'delete').
 */
export function showCrudSuccess(action) {
  let message = ''

  switch (action) {
    case 'create':
      message = 'Data berhasil ditambahkan!'
      break
    case 'update':
      message = 'Data berhasil diperbarui!'
      break
    case 'delete':
      message = 'Data berhasil dihapus!'
      break
    default:
      message = 'Operasi berhasil!'
  }

  showSuccess(message)
}

/**
 * Menampilkan pesan error berwarna merah.
 * @param {string} message - Isi pesan kesalahan.
 */
export function showError(message) {
  Swal.fire({
    icon: 'error',
    title: 'Gagal',
    text: message,
    confirmButtonText: 'OK'
  })
}

/**
 * Menampilkan kotak konfirmasi (Ya/Batal) sebelum melakukan aksi penting (seperti menghapus data).
 * @param {string} message - Pertanyaan konfirmasi.
 * @returns {Promise<boolean>} - Mengembalikan true jika user memilih 'Ya'.
 */
export async function showConfirm(message) {
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Yakin?',
    text: message,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal'
  })
  return result.isConfirmed
}
