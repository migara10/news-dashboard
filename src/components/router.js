import { createRouter, createWebHashHistory  } from "vue-router";

const isUserLoggedIn = () => {
    return !!localStorage.getItem('accessToken')
}
/* const isUser = () => {
    return JSON.parse(localStorage.getItem('user')).role
} */



const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import("./views/HomePage"),
        children: [
            {
                path: '/employees',
                name: 'employees',
                component: () => import("./views/Employees/EmployeePage.vue"),
                meta: {
                    hideDashBord: true,
                }
            },
            {
                path: '/category',
                name: 'category',
                component: () => import("./views/Category/CategoryPage.vue"),
                meta: {
                    hideDashBord: true,
                }
            },
        ],
    },
    {
        path: '/login',
        name: 'login',
        component: () => import("./views/LoginPage"),
        meta: {
            hideNavbar: true,
        }
    },
];

const router = createRouter({
    history: createWebHashHistory (),
    routes,
    linkActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
    if (((to.name !== 'login')) && !isUserLoggedIn()) next({ name: 'login' })
    else next()
})

// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
    // Remove initial loading
    const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
        appLoading.style.display = 'none'
    }
})

export default router