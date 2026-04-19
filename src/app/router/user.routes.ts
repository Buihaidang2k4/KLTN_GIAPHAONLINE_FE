import UserLayout from "@/components/layouts/user/UserLayout.vue";

export default [
    {
        path: "/family",
        component: UserLayout,
        redirect: "/family/tong-quan",
        meta: { requiresAuth: true, requiresActiveAccount: true },
        children: [
            {
                path: "tong-quan",
                name: "FamilyDashboard",
                component: () => import("@/views/family/FamilyDashboard.vue"),
            },
            {
                path: "danh-sach",
                name: "FamilyList",
                component: () => import("@/views/family/FamilyTreeContainer.vue"),
            },
            {
                path: "so-do-cay",
                name: "FamilyChart",
                component: () => import("@/views/family/FamilyChartViewer.vue"),
            },
            {
                path: "xuat-file",
                name: "FamilyExport",
                component: () => import("@/views/family/FamilyExportPage.vue"),
                meta: { permissions: ["FAM_EXPORT"] },
            },
            {
                path: "su-kien",
                name: "FamilyEvents",
                component: () => import("@/views/family/FamilyEvents.vue"),
                meta: { permissions: ["EVENT_MANAGE"] },
            },
            {
                path: "danh-muc-bai-viet",
                name: "FamilyPostCategory",
                component: () => import("@/views/family/FamilyPostCategory.vue"),
                meta: { permissions: ["POST_MANAGE"] },
            },
            {
                path: "thu-vien-anh",
                name: "FamilyAlbum",
                component: () => import("@/views/family/FamilyAlbum.vue"),
                meta: { permissions: ["ALBUM_MANAGE"] },
            },
            {
                path: "bai-viet",
                name: "FamilyPost",
                component: () => import("@/views/family/FamilyPosts.vue"),
                meta: { permissions: ["POST_MANAGE"] },
            },
            {
                path: "cau-hinh",
                name: "FamilySetting",
                component: () => import("@/views/family/FamilySetting.vue"),
                meta: { permissions: ["FAM_SETTINGS_EDIT"] },
            },
            {
                path: "quan-li-loi-moi",
                name: "FamilyManageInvition",
                component: () => import("@/views/family/FamilyManageInvitation.vue"),
            },
            {
                path: "thanh-tich",
                name: "FamilyAchievements",
                component: () => import("@/views/family/FamilyAchievements.vue"),
            },
            {
                path: "phong-tuc",
                name: "FamilyCustoms",
                component: () => import("@/views/family/FamilyCustoms.vue"),
            }, {
                path: "quan-li-thanh-vien",
                name: "FamilyManage",
                component: () => import("@/views/family/FamilyManage.vue")
            }, {
                path: "tai-khoan",
                name: "FamilyAccount",
                component: () => import("@/views/family/FamilyAccount.vue")
            }
        ],
    },
]