import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import adminRoutes from "./admin.routes";
import authRoutes from "./auth.routes";
import publicRoutes from "./public.routes";
import userRoutes from "./user.routes";
import { getCurrentUser } from "@/composables/auth/auth.storage";
import { authService } from "@/services/auth.service";
import { hasAnyPermission } from "@/composables/auth/auth.permission.helper";
import { roleService } from "@/services/role.service";

export const clearRouterCache = () => { _cachedProfile = null; }

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

// Cache profile trong memory để tránh gọi API mỗi lần navigate
let _cachedProfile: any = null;

router.beforeEach(async (to, from, next) => {
    const isGuestOnly = !!to.meta.guestOnly;
    const requiresAuth = !!to.meta.requiresAuth;
    const requiresActiveAccount = !!to.meta.requiresActiveAccount;
    const requiresSystemRole = !!to.meta.requiresSystemRole;
    const requiredPermissions = to.meta.permissions as string[] | undefined;

    let profileRes = null;

    try {
        const currentAccount = getCurrentUser();
        if (currentAccount) {
            profileRes = { data: currentAccount };
            _cachedProfile = profileRes;
        } else if (_cachedProfile) {
            profileRes = _cachedProfile;
        } else {
            profileRes = await authService.getMyInfo();
            _cachedProfile = profileRes;
        }
    } catch (error) {
        profileRes = null;
        _cachedProfile = null;
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

    if (requiresSystemRole && isLoggedIn) {
        try {
            const res = await roleService.isSystemAccount();
            if (res.data !== true) return next("/403");
        } catch {
            return next("/403");
        }
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