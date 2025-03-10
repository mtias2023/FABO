import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Componentes
const Login = () => import('../components/Auth/Login.vue');
const Registro = () => import('../components/Auth/Registro.vue');
const ListaPublicaciones = () => import('../components/Publicaciones/ListaPublicaciones.vue');
const Bienvenidos = () => import('../components/Bienvenidos.vue');
const NuevaPublicacion = () => import('../components/Publicaciones/NuevaPublicacion.vue');
const EditarPublicacion = () => import('../components/Publicaciones/EditarPublicacion.vue');
const Perfil = () => import('../components/Perfil.vue');
const ChatPrivado = () => import('../components/ChatPrivado.vue');
const CrearPartido = () => import('../components/CrearPartido.vue');
const Partidos = () => import('../components/Partidos.vue');
const Chat = () => import('../components/Chat.vue');
const Jugadores = () => import('../components/Jugadores.vue');
const Notificaciones = () => import('../components/Notificaciones.vue');
const NotFound = () => import('../components/NotFound.vue');

const routes = [
  { path: '/', component: ListaPublicaciones, name: 'ListaPublicaciones' },
  { path: '/bienvenidos', component: Bienvenidos, name: 'Bienvenidos' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/registro', component: Registro, name: 'Registro' },
  { path: '/nueva-publicacion', component: NuevaPublicacion, name: 'NuevaPublicacion' },
  { path: '/editar-publicacion/:id', component: EditarPublicacion, name: 'EditarPublicacion' },
  { path: '/perfil', component: Perfil, name: 'Perfil' },
  { path: '/chat-privado/:destinatarioId/:destinatarioNombre?', component: ChatPrivado, name: 'ChatPrivado' },
  { path: '/crear-partido', component: CrearPartido, name: 'CrearPartido' },
  { path: '/notificaciones', component: Notificaciones, name: 'Notificaciones' },
  { path: '/partidos', component: Partidos, name: 'Partidos' },
  {
    path: '/partido/:id/jugadores',
    component: Jugadores,
    name: 'Jugadores',
    props: (route) => ({ id: route.params.id }),
  }, 
  { path: '/chat', component: Chat, name: 'Chat' },
  { path: '/:pathMatch(.*)*', component: NotFound, name: 'NotFound' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Verificación de autenticación
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const publicPages = ['Login', 'Registro', 'Bienvenidos'];
  const authRequired = !publicPages.includes(to.name);

  if (!authRequired) {
    next();
    return;
  }

  onAuthStateChanged(auth, user => {
    if (!user) {
      next({ name: 'Login' });
    } else {
      next();
    }
  });
});

export default router;
