import Login from "@/views/Auth/login.vue";
import Register from "@/views/Auth/register.vue";
import Dashboard from "@/views/dashboard.vue";
import Index from "@/views/index.vue";
import path from "node:path";
import { createRouter, createWebHistory } from "vue-router";


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
]

const router = createRouter({
    history: createWebHistory(),
    routes
  });
  
  export default router;