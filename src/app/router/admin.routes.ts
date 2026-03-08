import SystemLayout from "@/components/layouts/system/SystemLayout.vue";

export default [
    {
        path: "/system",
        component: SystemLayout,
        children: [
            {
                path: "",
                component: () => import("@/views/dashboard/SystemDashboard.vue"),
            },
        ]
    },
]