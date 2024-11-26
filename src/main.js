import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router.js';


// Importa Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// (Opzionale) Importa Bootstrap JS per funzionalità interattive
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

createApp(App).use(router).mount('#app')
