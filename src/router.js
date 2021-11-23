import { createWebHistory, createRouter } from "vue-router";

import PollCreate from '/@/components/polls/create/PollCreate.vue';
import PollSettings from '/@/components/polls/settings/PollSettings.vue';
import Home from '/@/components/Home.vue'
import Authenticate from '/@/components/oauth/Authenticate.vue'
import Authenticated from '/@/components/oauth/Authenticated.vue'

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/poll/create',
            component: PollCreate
        },
        {
            path: '/poll/settings',
            component: PollSettings
        },
        {
            path: '/home',
            component: Home
        },
        {
            path: '/authenticate',
            component: Authenticate
        },
        {
            path: '/authenticated',
            component: Authenticated
        }
    ]
});