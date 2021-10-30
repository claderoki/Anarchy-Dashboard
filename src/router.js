import { createWebHistory, createRouter } from "vue-router";

import Polls from './components/polls/edit/Main.vue';
import Home from './components/Home.vue'

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/polls',
            component: Polls
        },
        {
            path: '/home',
            component: Home
        }
    ]
});