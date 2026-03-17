import SystemLayout from "@/components/layouts/system/SystemLayout.vue";

export default [
    {
        path: "/System",
        component: SystemLayout,
        children: [
            {
                path: "",
                name: "SystemDashboard",
                component: () => import("@/views/dashboard/SystemDashboard.vue"),
            },
            {
                path: "Dashboard",
                name: "Dashboard",
                component: () => import("@/views/dashboard/DashboardView.vue"),
            },
            {
                path: "Accounts",
                name: "Accounts",
                component: () => import("@/views/dashboard/DashboardAccounts.vue"),
            },
            {
                path: "Subscriptions",
                name: "Subscriptions",
                component: () => import("@/views/dashboard/DashboardSubscriptions.vue"),
            },
            {
                path: "Transactions",
                name: "Transactions",
                component: () => import("@/views/dashboard/DashboardTransactions.vue"),
            },
            {
                path: "Posts",
                name: "Posts",
                component: () => import("@/views/dashboard/DashboardPosts.vue"),
            },
            {
                path: "Categories",
                name: "Categories",
                component: () => import("@/views/dashboard/DashboardCategories.vue"),
            },
            {
                path: "WebConfig",
                name: "WebConfig",
                component: () => import("@/views/dashboard/DashboardWebConfig.vue"),
            },

        ]
    },
]