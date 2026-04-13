import Admin from "@/views/Admin/admin.vue";
import CreateUser from "@/views/Admin/manage-user/create-user.vue";
import EditUser from "@/views/Admin/manage-user/edit-user.vue";
import ManageUser from "@/views/Admin/manage-user/manage-user.vue";
import Login from "@/views/Auth/login.vue";
import Register from "@/views/Auth/register.vue";
import Dashboard from "@/views/dashboard.vue";
import CreateKategori from "@/views/Admin/kategori/create-kategori.vue";
import EditKategori from "@/views/Admin/kategori/edit-kategori.vue";
import Kategori from "@/views/Admin/kategori/kategori.vue";
import Profile from "@/views/Settings/profil.vue";
import EditProfil from "@/views/Settings/editprofil.vue";
import CreateAlamat from "@/views/Alamat/create-alamat.vue";
import Produk from "@/views/produk/produk.vue";
import Alamat from "@/views/Alamat/alamat.vue";
import Checkout from "@/views/checkout/checkout.vue";
import Cart from "@/views/cart/cart.vue";
import path from "node:path";
import { createRouter, createWebHistory } from "vue-router";
import ManageKategoriProduk from "@/views/seller/manage-kategori/manage-kategori-produk.vue";
import CreateKategoriProduk from "@/views/seller/manage-kategori/create-kategori-produk.vue";
import EditKategoriProduk from "@/views/seller/manage-kategori/edit-kategori-produk.vue";
import Seller from "@/views/seller/seller.vue";
import ManageProduk from "@/views/seller/manage-product/manage-produk.vue";
import CreateProduk from "@/views/seller/manage-product/create-produk.vue";
import EditProduk from "@/views/seller/manage-product/edit-produk.vue";
import ManageFotoProduk from "@/views/seller/manage-product/manage-foto-produk.vue";
import EditFotoProduct from "@/views/seller/manage-product/edit-foto-product.vue";
import CreateFotoProduct from "@/views/seller/manage-product/create-foto-product.vue";
import ManageToko from "@/views/seller/manage-toko/manage-toko.vue";
import CreateToko from "@/views/seller/manage-toko/create-toko.vue";
import EditToko from "@/views/seller/manage-toko/edit-toko.vue";
import Settings from "@/views/Settings/settings.vue";
import ListTransaksi from "@/views/checkout/list-transaksi.vue";
import TransaksiSelesai from "@/views/checkout/transaksi-selesai.vue";
import History from "@/views/checkout/history.vue";
import Toko from "@/views/toko/toko.vue";
import RequestSeller from "@/views/Settings/request-seller.vue";
import ManageRequest from "@/views/Admin/manage-request/manage-request.vue";
import Track from "@/views/checkout/track.vue";
import SettingsAdmin from "@/views/Admin/settings/settings-admin.vue";
import ManagePengiriman from "@/views/seller/manage-pengiriman/manage-pengiriman.vue";
import ManageIncome from "@/views/Admin/manage-income/manage-income.vue";
import Withdraw from "@/views/seller/withdraw/withdraw.vue";
import ManageBanner from "@/views/Admin/manage-banner/manage-banner.vue";
import VerifyPage from "@/views/Auth/verify.vue";
import ResetPass from "@/views/Auth/forget-pass.vue";
import RequestResetPass from "@/views/Auth/request-forget-pass.vue";
import EditAlamat from "@/views/Alamat/edit-alamat.vue"

/**
 * Konfigurasi Navigasi Halaman (Routing).
 * Di sini kita menentukan alamat URL (path) dan halaman mana yang akan ditampilkan.
 */
const routes = [
    // Dashboard - Halaman Utama
    {
        path: '/',
        redirect: '/dashboard' 
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
    },

    // Autentikasi (Masuk, Daftar, Verifikasi, Lupa Password)
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/verify',
        name: 'Verify',
        component: VerifyPage
    },
    {
        path: '/forget-password',
        name: 'Forget Password',
        component: RequestResetPass
    },
    {
        path: '/reset-password',
        name: 'reset Password',
        component: ResetPass
    },

    // Bagian Admin (Manajemen User, Kategori, Banner, dll)
    {
        path: '/admin',
        name: 'Admin',
        component: Admin
    },
    {
        path: '/manage-user',
        name: 'ManageUser',
        component: ManageUser
    },
    {
        path: '/create-user',
        name: 'CreateUser',
        component: CreateUser
    },
    {
        path: '/edit-user/:id',
        name: 'EditUser',
        component: EditUser
    },
    {
        path: '/kategori',
        name: 'kategori',
        component: Kategori
    },
    {
        path: '/create-kategori',
        name: 'createKategori',
        component: CreateKategori
    },
    {
        path: '/edit-kategori/:id',
        name: 'editKategori',
        component: EditKategori
    },

    // Produk & Detail Produk
    {
        path: '/produk/:id',
        name: 'Produk',
        component: Produk
    },

    // Pengaturan Profil & Alamat
    {
        path: '/settings',
        name: 'Settings',
        component: Settings
    },
    {
        path: '/profile',
        name: 'profile',
        component: Profile
    },
    {
        path: '/edit-profil/:id',
        name: 'editProfil',
        component: EditProfil
    },
    {
        path: '/alamat',
        name: 'alamat',
        component: Alamat
    },
    {
        path: '/create-alamat',
        name: 'CreateAlamat',
        component: CreateAlamat
    },
    {
        path: '/edit-alamat/:id',
        name: 'EditAlamat',
        component: EditAlamat
    },

    // Keranjang & Proses Checkout
    {
        path: '/checkout/:kode',
        name: 'checkout',
        component: Checkout
    },
    {
        path: '/cart',
        name: 'cart',
        component: Cart
    },

    // Bagian Seller (Penjual) - Manajemen Produk, Toko, Pengiriman, Withdraw
    {
        path: '/seller',
        name: 'seller',
        component: Seller
    },
    {
        path: '/manage-produk',
        name: 'product',
        component: ManageProduk
    },
    {
        path: '/create-produk',
        name: 'createproduk',
        component: CreateProduk
    },
    {
        path: '/edit-produk/:id',
        name: 'editproduk',
        component: EditProduk
    },
    {
        path: '/manage-kategori-produk',
        name: 'managekategoriproduct',
        component: ManageKategoriProduk
    },
    {
        path: '/create-kategori-produk',
        name: 'createkategoriproduk',
        component: CreateKategoriProduk
    },
    {
        path: '/edit-kategori-produk/:id',
        name: 'editkategoriproduk',
        component: EditKategoriProduk
    },
    {
        path: '/manage-foto-product',
        name: 'manageFotoproduct',
        component: ManageFotoProduk
    },
    {
        path: '/edit-foto-product/:id',
        name: 'editfotoproduct',
        component: EditFotoProduct
    },
    {
        path: '/create-foto-product',
        name: 'createfotoproduct',
        component: CreateFotoProduct
    },
    {
        path: '/manage-toko',
        name: 'managetoko',
        component: ManageToko
    },
    {
        path: '/create-toko',
        name: 'createtoko',
        component: CreateToko
    },
    {
        path: '/edit-toko/:id',
        name: 'editToko',
        component: EditToko
    },
    {
        path: '/list-transaksi',
        name: 'listTransaksi',
        component: ListTransaksi
    },
    {
        path: '/transaksi-selesai',
        name: 'transaksiSelesai',
        component: TransaksiSelesai
    },
    {
        path: '/history-transaksi',
        name: 'historyTransaksi',
        component: History
    },
    {
        path: '/toko',
        name: 'toko',
        component: Toko
    },
    {
        path: '/pengajuan-seller',
        name: 'pengajuanSeller',
        component: RequestSeller
    },
    {
        path: '/manage-request',
        name: 'manageRequest',
        component: ManageRequest
    },
    {
        path: '/track-order/:id',
        name: 'trackOrder',
        component: Track
    },
    {
        path: '/settings-admin',
        name: 'settingsAdmin',
        component: SettingsAdmin
    },
    {
        path: '/manage-pengiriman/',
        name: 'managePengiriman',
        component: ManagePengiriman
    },
    {
        path: '/manage-income',
        name: 'manageIncome',
        component: ManageIncome
    },
    {
        path: '/withdraw',
        name: 'withdraw',
        component: Withdraw
    },
    {
        path: '/manage-banner',
        name: 'manageBanner',
        component: ManageBanner
    }
]

/**
 * Membuat instance router dengan mode history untuk URL yang bersih.
 */
const router = createRouter({
    history: createWebHistory(),
    routes
  });
  
/**
 * Daftar alamat halaman yang boleh diakses tanpa harus login (Publik).
 */
const publicPages = [
    '/dashboard',
    '/login',
    '/register',
    '/verify',
    '/forget-password',
    '/reset-password'
  ]

/**
 * Mengecek apakah rute produk yang diminta bersifat publik (misalnya detail produk).
 */
const isPublicDynamic = (path) => {
  return path.startsWith('/produk/')
}

/**
 * Pelindung Rute (Route Guard).
 * Fungsi ini mengecek apakah user sudah login sebelum masuk ke halaman yang butuh keamanan (seperti Admin/Seller).
 */
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token")

  const isPublic =
    publicPages.includes(to.path) ||
    isPublicDynamic(to.path)

  // Jika halaman butuh login dan user tidak punya token, arahkan ke halaman Login
  if (!isPublic && !token) {
    return next('/login')
  }

  next()
})

export default router;
