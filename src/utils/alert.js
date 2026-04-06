import Swal from 'sweetalert2'

// Alert buat nunjukin kalo aksinya berhasil, cuma nongol 2 detik terus ilang sendiri
export function showSuccess(message) {
  Swal.fire({
    icon: 'success',
    title: 'Berhasil',
    text: message,
    timer: 2000,
    showConfirmButton: false
  })
}

// Shortcut biar gak ribet ngetik pesan sukses CRUD berulang-ulang
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

// Alert buat nunjukin kalo ada yang salah/gagal
export function showError(message) {
  Swal.fire({
    icon: 'error',
    title: 'Gagal',
    text: message,
    confirmButtonText: 'OK'
  })
}

// Alert konfirmasi, nanya dulu ke user beneran yakin apa kagak
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
