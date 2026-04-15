
export default [
    {
        path: "/login",
        name: "Login",
        component: () => import("@/views/auth/LoginPage.vue"),
        meta: { guestOnly: true }
    },
    {
        path: "/register",
        name: "Register",
        component: () => import("@/views/auth/RegisterPage.vue"),
        meta: { guestOnly: true }
    },
    {
        path: "/forgot-password",
        name: "ForgotPassword",
        component: () => import("@/views/auth/ForgotPassowordPage.vue"),
        meta: { guestOnly: true }
    },
    {
        path: "/verify-account",
        name: "VerifyAccount",
        component: () => import("@/views/auth/RegisterSuccessVerify.vue"),
        meta: { guestOnly: true }
    }
]