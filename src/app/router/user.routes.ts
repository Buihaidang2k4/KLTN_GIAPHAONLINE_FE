import UserLayout from "@/components/layouts/user/UserLayout.vue";

export default [
    {
        path: "/family/so-do-cay",
        name: "FamilyChart",
        component: () => import("@/views/family/FamilyChartViewer.vue"),
        meta: { requiresAuth: true, requiresActiveAccount: true },
    },
    {
        path: "/family",
        component: UserLayout,
        redirect: "/family/tong-quan",
        meta: { requiresAuth: true, requiresActiveAccount: true },
        children: [
            {
                path: "tong-quan",
                name: "FamilyDashboard",
                component: () => import("@/views/family/FamilyDashboardPage.vue"),
            },
            {
                path: "danh-sach",
                name: "FamilyList",
                component: () => import("@/views/family/FamilyTreeContainerPage.vue"),
            },
            {
                path: "phan-hoi",
                name: "FamilyFeedback",
                component: () => import("@/views/family/FamilyFeedbackPage.vue"),
            },
            {
                path: "su-kien",
                name: "FamilyEvents",
                component: () => import("@/views/family/FamilyEventsPage.vue"),
                meta: { permissions: ["EVENT_MANAGE"] },
            },
            {
                path: "danh-muc-bai-viet",
                name: "FamilyPostCategory",
                component: () => import("@/views/family/FamilyPostCategoryPage.vue"),
                meta: { permissions: ["POST_MANAGE"] },
            },
            {
                path: "thu-vien-anh",
                name: "FamilyAlbum",
                component: () => import("@/views/family/FamilyAlbumsPage.vue"),
                meta: { permissions: ["ALBUM_MANAGE"] },
            },
            {
                path: "bai-viet",
                name: "FamilyPost",
                component: () => import("@/views/family/FamilyPostsPage.vue"),
                meta: { permissions: ["POST_MANAGE"] },
            },
            {
                path: "bai-viet/soan-thao",
                name: "FamilyPostEditor",
                component: () => import("@/views/family/FamilyPostEditorPage.vue"),
                meta: { permissions: ["POST_MANAGE"] },
            },
            {
                path: "cau-hinh",
                name: "FamilySetting",
                component: () => import("@/views/family/FamilySettingPage.vue"),
                meta: { permissions: ["FAM_SETTINGS_EDIT"] },
            },
            {
                path: "quan-li-loi-moi",
                name: "FamilyManageInvition",
                component: () => import("@/views/family/FamilyManageInvitationPage.vue"),
            },
            {
                path: "thanh-tich",
                name: "FamilyAchievements",
                component: () => import("@/views/family/FamilyAchievementsPage.vue"),
            },
            {
                path: "phong-tuc",
                name: "FamilyCustoms",
                component: () => import("@/views/family/FamilyCustomsPage.vue"),
            },
            {
                path: "quan-li-thanh-vien",
                name: "FamilyManage",
                component: () => import("@/views/family/FamilyManageMembersPage.vue")
            },
            {
                path: "tai-khoan",
                name: "FamilyAccount",
                component: () => import("@/views/family/FamilyAccountsPage.vue")
            },
            {
                path: "lich-su-hoat-dong",
                name: "FamilyAuditHistory",
                component: () => import("@/views/family/FamilyAuditHistorysPage.vue")
            },
            {
                path: "dich-vu",
                name: "FamilyService",
                component: () => import("@/views/family/FamilyServicePage.vue")
            },
            {
                path: "thanh-toan/:planId",
                name: "FamilyPaymentDetails",
                component: () => import("@/views/family/FamilyServiceDetails.vue")
            },
            {
                path: "chi-tiet-thanh-toan",
                name: "FamilyPaymentResult",
                component: () => import("@/views/family/FamilyPaymentResult.vue")
            },

            {
                path: "lich-su-thanh-toan",
                name: "FamilyPaymentHistory",
                component: () => import("@/views/family/FamilyPaymentHistoryPage.vue")
            }

        ],
    },
]