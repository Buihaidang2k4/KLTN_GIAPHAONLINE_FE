// import router from "../router";

// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('token')
//   const perms = JSON.parse(localStorage.getItem('permissions') || '[]')

//   if (to.meta.requiresAuth && !token) {
//     return next('/login')
//   }

//   if (to.meta.permission && !perms.includes(to.meta.permission)) {
//     return next('/403')
//   }

//   next()
// })
