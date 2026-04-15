import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import adminRoutes from "./admin.routes";
import authRoutes from "./auth.routes";
import publicRoutes from "./public.routes";
import userRoutes from "./user.routes";
import { getCurrentUser } from "@/hooks/logic/auth/auth.storage";
import { authService } from "@/services/auth.service";
import { hasAnyPermission } from "@/hooks/logic/auth/auth.permission.helper";

// router
const routes: RouteRecordRaw[] = [
    ...publicRoutes,
    ...(authRoutes || []),
    ...(userRoutes || []),
    ...(adminRoutes || []),
    {
        path: "/403",
        name: "Forbidden",
        component: () => import("@/views/error/ForbiddenPage.vue"),
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("@/views/error/NotFound.vue"),
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
        if (to.hash) {
            return { el: to.hash }
        }

        // nếu không có savedPosition thì trả về top: 0
        return {
            top: 0,
            behavior: 'smooth'
        }
    }
})

router.beforeEach(async (to, from, next) => {
    const isGuestOnly = !!to.meta.guestOnly;
    const requiresAuth = !!to.meta.requiresAuth;
    const requiresActiveAccount = !!to.meta.requiresActiveAccount;
    const requiredPermissions = to.meta.permissions as string[] | undefined;

    let profileRes = null;

    try {
        const currentAccount = getCurrentUser();
        if (currentAccount) profileRes = { data: currentAccount };
        else profileRes = await authService.getMyInfo();
    } catch (error) {
        profileRes = null;
    }

    const currentAccount = profileRes?.data ?? null;
    const isLoggedIn = !!currentAccount;
    const isActive = currentAccount?.accountStatus === "ACTIVE";

    if (isGuestOnly && isLoggedIn) {
        return next("/family/tong-quan");
    }

    if (requiresAuth && !isLoggedIn) {
        return next({
            path: "/login",
            query: { redirect: to.fullPath },
        });
    }

    if (requiresActiveAccount && isLoggedIn && !isActive) {
        return next("/verify-account");
    }

    if (requiredPermissions?.length) {
        const allowed = hasAnyPermission(currentAccount, requiredPermissions);
        if (!allowed) {
            return next("/403");
        }
    }

    return next();
}
)

export default router