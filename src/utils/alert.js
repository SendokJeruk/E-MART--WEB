import Swal from 'sweetalert2'

export function showSuccess(message) {
  Swal.fire({
    icon: 'success',
    title: 'Berhasil',
    text: message,
    timer: 2000,
    showConfirmButton: false
  })
}

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

export function showError(message) {
  Swal.fire({
    icon: 'error',
    title: 'Gagal',
    text: message,
    confirmButtonText: 'OK'
  })
}

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
