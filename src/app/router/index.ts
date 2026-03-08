import { createRouter, createWebHistory } from "vue-router";
import adminRoutes from "./admin.routes";
import authRoutes from "./auth.routes";
import publicRoutes from "./public.routes";
import userRoutes from "./user.routes";

// router
const routes = [
    ...publicRoutes,
    ...authRoutes,
    ...userRoutes,
    ...adminRoutes,
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("@/views/NotFound.vue"),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // nếu có savedPosition thì trả về savedPosition
        if (savedPosition) {
            return savedPosition;
        }
        // nếu không có savedPosition thì trả về top: 0
        return {
            top: 0,
            behavior: 'smooth'
        }
    }
})

export default router