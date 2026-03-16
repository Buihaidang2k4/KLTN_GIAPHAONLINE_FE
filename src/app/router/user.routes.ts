import UserLayout from "@/components/layouts/user/UserLayout.vue";

export default [
    {
        path: "/family",
        component: UserLayout,
        children: [
            {
                path: "chart",
                name: "FamilyChart",
                component: () => import("@/views/family/FamilyChartPage.vue"),
            },
            {
                path: "export",
                name: "FamilyExport",
                component: () => import("@/views/family/FamilyExportPage.vue"),
            },
        ],
    },
]