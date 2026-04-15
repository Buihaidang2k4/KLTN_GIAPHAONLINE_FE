import HomeLayout from "@/components/layouts/home/HomeLayout.vue";

export default [
    {
        path: "/",
        component: HomeLayout,
        children: [
            {
                path: "",
                name: "Home",
                component: () => import("@/views/home/HomePage.vue"),
                meta: { public: true }
            },

            {
                path: "post",
                name: "HomePost",
                component: () => import("@/views/home/HomePostPage.vue"),
                meta: { public: true }
            },
        ]
    },
]