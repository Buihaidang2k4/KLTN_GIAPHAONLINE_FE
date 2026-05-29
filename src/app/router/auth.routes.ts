
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
        component: () => import("@/views/auth/ForgotPasswordPage.vue"),
        meta: { guestOnly: true }
    },
    {
        path: "/verify-account",
        name: "VerifyAccount",
        component: () => import("@/views/auth/RegisterSuccessVerify.vue"),
        meta: { guestOnly: true }
    },
    {
        path: "/verify-account-forgot",
        name: "VerifyAccountForgot",
        component: () => import("@/views/auth/ForgotPasswordVerifyOtpPage.vue"),
        meta: { guestOnly: true }
    },
    {
        path: "/reset-password",
        name: "ResetPasword",
        component: () => import("@/views/auth/ResetPasswordPage.vue"),
        meta: { guestOnly: true }
    },
    {
        path: "/register-by-invitation/:token",
        name: "RegisterByInvitation",
        component: () => import("@/views/auth/RegisterForInvitationPage.vue"),
        meta: { guestOnly: true }
    }
]