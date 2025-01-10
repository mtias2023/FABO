import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import './style.css'; 
import './firebase'; 
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'leaflet/dist/leaflet.css';


createApp(App)
  .use(router)
  .mount('#app');


