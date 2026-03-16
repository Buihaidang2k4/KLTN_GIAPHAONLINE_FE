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
            },

            {
                path: "post",
                name: "HomePost",
                component: () => import("@/views/home/HomePostPage.vue"),
            },
        ]
    },
]