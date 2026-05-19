import SystemLayout from "@/components/layouts/system/SystemLayout.vue";

export default [
    {
        path: "/system",
        component: SystemLayout,
        meta: { requiresAuth: true, requiresActiveAccount: true, requiresSystemRole: true },
        children: [
            {
                path: "",
                name: "SystemDashboard",
                component: () => import("@/views/dashboard/SystemDashboard.vue"),
            },
            {
                path: "accounts",
                name: "Accounts",
                component: () => import("@/views/dashboard/DashboardAccounts.vue"),
            },
            {
                path: "subscriptions",
                name: "Subscriptions",
                component: () => import("@/views/dashboard/DashboardSubscriptions.vue"),
            },
            {
                path: "transactions",
                name: "Transactions",
                component: () => import("@/views/dashboard/DashboardTransactions.vue"),
            },
            {
                path: "posts",
                name: "Posts",
                component: () => import("@/views/dashboard/DashboardArticle.vue"),
            },
            {
                path: "categories",
                name: "Categories",
                component: () => import("@/views/dashboard/DashboardCategories.vue"),
            },
            {
                path: "web-config",
                name: "WebConfig",
                component: () => import("@/views/dashboard/DashboardWebConfig.vue"),
            },
            {
                path: "roles",
                name: "Roles",
                component: () => import("@/views/dashboard/DashboardRoles.vue"),
            },
            {
                path: "permissions",
                name: "Permissions",
                component: () => import("@/views/dashboard/DashboardPermissions.vue"),
            },

        ]
    },
]