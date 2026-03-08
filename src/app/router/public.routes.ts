import HomeLayout from "@/components/layouts/home/HomeLayout.vue";

export default [
    {
        path: "/",
        component: HomeLayout,
        children: [
            {
                path: "",
                component: () => import("@/views/home/Home.vue"),
            },

            {
                path: "post",
                component: () => import("@/views/home/HomePost.vue"),
            },
        ]
    },
]