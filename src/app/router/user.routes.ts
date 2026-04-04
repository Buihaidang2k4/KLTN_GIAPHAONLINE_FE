import UserLayout from "@/components/layouts/user/UserLayout.vue";

export default [
    {
        path: "/family",
        component: UserLayout,
        // Cập nhật redirect cho khớp với path mới của dashboard
        redirect: "/family/tong-quan", 
        children: [
            {
                // dashboard -> tong-quan
                path: "tong-quan",
                name: "FamilyDashboard",
                component: () => import("@/views/family/FamilyDashboard.vue"),
            },
            {
                // danh-sach-gia-pha -> danh-sach
                path: "danh-sach",
                name: "FamilyList",
                component: () => import("@/views/family/FamilyTreeContainer.vue")
            }
            , {
                // chart -> so-do-cay
                path: "so-do-cay",
                name: "FamilyChart",
                component: () => import("@/views/family/FamilyChartViewer.vue"),
            },
            {
                // export -> xuat-file
                path: "xuat-file",
                name: "FamilyExport",
                component: () => import("@/views/family/FamilyExportPage.vue"),
            },
            {
                // events -> su-kien
                path: "su-kien",
                name: "FamilyEvents",
                component: () => import("@/views/family/FamilyEvents.vue"),
            },
            {
                // categories -> danh-muc-bai-viet
                path: "danh-muc-bai-viet",
                name: "FamilyPostCategory",
                component: () => import("@/views/family/FamilyPostCategory.vue")
            },
            {
                // album -> thu-vien-anh
                path: "thu-vien-anh",
                name: "FamilyAlbum",
                component: () => import("@/views/family/FamilyAlbum.vue")
            },
            {
                // posts -> bai-viet
                path: "bai-viet",
                name: "FamilyPost",
                component: () => import("@/views/family/FamilyPosts.vue")
            }
            , {
                // settings -> cau-hinh
                path: "cau-hinh",
                name: "FamilySetting",
                component: () => import("@/views/family/FamilySetting.vue")
            }
            , {
                // email -> hop-thu
                path: "hop-thu",
                name: "FamilyEmail",
                component: () => import("@/views/family/FamilyEmail.vue")
            }
            , {
                // achievements -> thanh-tich
                path: "thanh-tich",
                name: "FamilyAchievements",
                component: () => import("@/views/family/FamilyAchievements.vue")
            }
        ],
    },
]