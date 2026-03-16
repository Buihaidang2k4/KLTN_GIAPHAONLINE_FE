import SystemLayout from "@/components/layouts/system/SystemLayout.vue";

export default [
    {
        path: "/system",
        component: SystemLayout,
        children: [
            {
                path: "",
                name: "SystemDashboard",
                component: () => import("@/views/dashboard/SystemDashboard.vue"),
            },
        ]
    },
]