import UserLayout from "@/components/layouts/user/UserLayout.vue";

export default [
    {
        path: "/family",
        component: UserLayout,
        redirect: "/family/dashboard",
        children: [
            {
                path: "dashboard",
                name: "FamilyDashboard",
                component: () => import("@/views/family/FamilyDashboard.vue"),
            },
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
            {
                path: "events",
                name: "FamilyEvents",
                component: () => import("@/views/family/FamilyEvents.vue"),
            },
            {
                path: "categories",
                name: "FamilyPostCategory",
                component: () => import("@/views/family/FamilyPostCategory.vue")
            },
            {
                path: "album",
                name: "FamilyAlbum",
                component: () => import("@/views/family/FamilyAlbum.vue")
            },
            {
                path: "posts",
                name: "FamilyPost",
                component: () => import("@/views/family/FamilyPosts.vue")
            }
            , {
                path: "settings",
                name: "FamilySetting",
                component: () => import("@/views/family/FamilySetting.vue")
            }
            , {
                path: "email",
                name: "FamilyEmail",
                component: () => import("@/views/family/FamilyEmail.vue")
            }
            , {
                path: "achievements",
                name: "FamilyAchievements",
                component: () => import("@/views/family/FamilyAchievements.vue")
            }
        ],
    },
]