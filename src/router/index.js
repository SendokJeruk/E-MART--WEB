import Admin from "@/views/Admin/admin.vue";
import CreateUser from "@/views/Admin/manage-user/create-user.vue";
import EditUser from "@/views/Admin/manage-user/edit-user.vue";
import ManageUser from "@/views/Admin/manage-user/manage-user.vue";
import Login from "@/views/Auth/login.vue";
import Register from "@/views/Auth/register.vue";
import Dashboard from "@/views/dashboard.vue";
import Index from "@/views/index.vue";
import CreateKategori from "@/views/admin/kategori/create-kategori.vue";
import EditKategori from "@/views/admin/kategori/edit-kategori.vue";
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
import ManageKategoriProduk from "@/views/seller/managekategori/manage-kategori-produk.vue";
import CreateKategoriProduk from "@/views/seller/managekategori/create-kategori-produk.vue";
import EditKategoriProduk from "@/views/seller/managekategori/edit-kategori-produk.vue";
import Seller from "@/views/seller/seller.vue";
import ManageProduk from "@/views/seller/manageproduct/manage-produk.vue";
import CreateProduk from "@/views/seller/manageproduct/create-produk.vue";
import EditProduk from "@/views/seller/manageproduct/edit-produk.vue";
import ManageFotoProduk from "@/views/seller/manageproduct/manage-foto-produk.vue";
import EditFotoProduct from "@/views/seller/manageproduct/edit-foto-product.vue";
import CreateFotoProduct from "@/views/seller/manageproduct/create-foto-product.vue";
import ManageToko from "@/views/seller/managetoko/manage-toko.vue";
import CreateToko from "@/views/seller/managetoko/create-toko.vue";
import EditToko from "@/views/seller/managetoko/edit-toko.vue";
import EditAlamatToko from "@/views/Alamat/edit-alamat-toko.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Index
    },

    // Dashboard

    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
    },

    //Auth
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

    // Admin
    {
        path: '/admin',
        name: 'Admin',
        component: Admin
    },

     //Manage User
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

     //Kategori Admin
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

    // Detail Produk
    {
        path: '/produk/:id',
        name: 'Produk',
        component: Produk
    },

    // Settings
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

    //Checkout + Cart
     {
        path: '/checkout',
        name: 'checkout',
        component: Checkout
    },
    {
        path: '/cart',
        name: 'cart',
        component: Cart
    },
    //Kategori Produk
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
        path: '/seller',
        name: 'seller',
        component: Seller
    },
    //Manage Produk
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
    //Manage Foto Produk
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
    //Toko
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
        path: '/edit/alamat-toko/:id',
        name: 'editAlamatToko',
        component: EditAlamatToko
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
  });
  
  export default router;