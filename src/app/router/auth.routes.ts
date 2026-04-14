
export default [
    {
        path: "/login",
        name: "Login",
        component: () => import("@/views/auth/LoginPage.vue"),
    },
    {
        path: "/register",
        name: "Register",
        component: () => import("@/views/auth/RegisterPage.vue"),
    },
    {
        path: "/forgot-password",
        name: "ForgotPassword",
        component: () => import("@/views/auth/ForgotPassowordPage.vue"),
    },

]