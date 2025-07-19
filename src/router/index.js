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
import path from "node:path";
import { createRouter, createWebHistory } from "vue-router";
import Produk from "@/views/produk/produk.vue";


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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
  });
  
  export default router;