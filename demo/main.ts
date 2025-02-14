import { createApp } from 'vue';
import App from './demo3.vue';
import Gantt from '../src/index';

// import Gantt from '../dist/index.es';
// import '../dist/style.css';

createApp(App).use(Gantt).mount('#app');
