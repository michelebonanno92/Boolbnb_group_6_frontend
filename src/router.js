import { createRouter, createWebHistory } from 'vue-router';

import HomePage from './views/HomePage.vue';
import ApartmentShow from './views/ApartmentShow.vue';
import NotFoundPage from './views/NotFoundPage.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage
        },
        {
            path: '/appartamento',
            name: 'apartment-show',
            component: ApartmentShow
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: NotFoundPage
        },
    ]
});

export { router };