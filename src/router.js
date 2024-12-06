import { createRouter, createWebHistory } from 'vue-router';

import HomePage from './views/HomePage.vue';
import ApartmentShow from './views/ApartmentShow.vue';
import Apartments from './views/Apartments.vue';
import NotFoundPage from './views/NotFoundPage.vue';
import Message from './views/Message.vue';
import mappa from './views/mappa.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage
        },
        {
            path: '/appartamento/:slug',
            name: 'apartment-show',
            component: ApartmentShow
        },
        {
            path: '/appartamenti',
            name: 'apartments',
            component: Apartments
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: NotFoundPage
        },
        {
            path: '/messaggio',
            name: 'message',
            component: Message
        },
        {
            path: '/mappa',
            name: 'mappe',
            component: mappa
        },
        
    ]
});



export { router };