import { createApp } from 'vue';

import App from '/@/App.vue';
import { router } from '/@/router.js';

import Block from '/@/components/form/Block.vue';
import BlockFooter from '/@/components/form/BlockFooter.vue';
import Row from '/@/components/form/Row.vue';

const app = createApp(App);

app.component('anarchy-block', Block);
app.component('anarchy-block-footer', BlockFooter);
app.component('anarchy-row', Row);

app.use(router);
app.mount('#app');
