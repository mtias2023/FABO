<template>
  <div class="app">
    <!-- Barra de navegación para PC -->
    <nav class="bg-zinc-100 p-4 shadow lg:block hidden">
      <div class="container mx-auto flex items-center justify-between">
        <!-- Logo -->
        <div class="flex-none">
          <router-link to="/">
            <img src="/img/logo.png" alt="FABO Logo" class="w-32 h-auto" />
          </router-link>
        </div>

        <!-- Enlaces centrados -->
        <div class="flex-1 flex justify-center space-x-6">
          <router-link v-if="isLoggedIn" to="/" :class="linkClass('/')">Comunidad</router-link>
          <router-link v-if="isLoggedIn" to="/crear-partido" :class="linkClass('/crear-partido')">Crear
            partido</router-link>
          <router-link v-if="isLoggedIn" to="/partidos" :class="linkClass('/partidos')">Partidos</router-link>
        </div>

        <!-- Iconos de perfil, chat y notificaciones -->
        <div class="flex space-x-3 items-center">
          <!-- Notificaciones -->
          <div v-if="isLoggedIn" class="relative">
            <button @click="toggleNotificaciones"
              class="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-400 text-white hover:bg-blue-700 transition-transform transform hover:scale-110">
              <i class="fa-solid fa-bell fa-lg"></i>
            </button>

            <!-- Modal de Notificaciones con animación -->
            <transition name="fade">
              <div v-if="mostrarNotificaciones"
                class="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
                <Notificaciones @cerrar="mostrarNotificaciones = false" />
              </div>
            </transition>
          </div>

          <!-- Perfil -->
          <router-link v-if="isLoggedIn" to="/perfil"
            class="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-400 text-white hover:bg-blue-700 transition-transform transform hover:scale-110">
            <i class="fa-solid fa-user fa-lg"></i>
          </router-link>

          <!-- Chat Público -->
          <router-link v-if="isLoggedIn" to="/chat"
            class="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-400 text-white hover:bg-blue-700 transition-transform transform hover:scale-110">
            <i class="fa-solid fa-message fa-lg"></i>
          </router-link>

          <!-- Cerrar sesión -->
          <span v-if="isLoggedIn" @click="logout"
            class="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white hover:bg-red-900 transition-transform transform hover:scale-110 cursor-pointer">
            <i class="fa-solid fa-right-from-bracket fa-lg"></i>
          </span>
          <!-- Sesiones de bienvenida y login solo si no está logueado -->
          <div v-if="!isLoggedIn" class="flex space-x-3">
            <router-link to="/bienvenidos" :class="linkClass('/bienvenidos')"
              class="text-black hover:text-cyan-400 cursor-pointer">Bienvenidos</router-link>
            <router-link to="/login" :class="linkClass('/login')"
              class="text-black hover:text-cyan-400 cursor-pointer">Iniciar sesión</router-link>
            <router-link to="/registro" :class="linkClass('/registro')"
              class="text-black hover:text-cyan-400 cursor-pointer">Registro</router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Menú hamburguesa (tablet y móvil) -->
    <div class="lg:hidden relative">
      <nav class="bg-zinc-100 p-4 shadow">
        <div class="container mx-auto flex items-center justify-between relative">
          <!-- Menú hamburguesa (Alineado a la izquierda) -->
          <button @click="menuAbierto = !menuAbierto"
            class="text-black focus:outline-none border-2 border-cyan-400 rounded-full w-8 h-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          <!-- Logo centrado -->
          <router-link to="/" class="flex-1 text-center">
            <img src="/img/logo.png" alt="FABO Logo" class="w-32 h-auto mx-auto" />
          </router-link>

          <!-- Notificaciones en la esquina superior derecha -->
          <div v-if="isLoggedIn" class="absolute top-0 right-4">
            <button @click="toggleNotificaciones"
              class="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-400 text-white hover:bg-blue-700 transition-transform transform hover:scale-110">
              <i class="fa-solid fa-bell fa-lg"></i>
            </button>

            <!-- Modal de Notificaciones con animación -->
            <transition name="fade">
              <div v-if="mostrarNotificaciones"
                class="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
                <Notificaciones @cerrar="mostrarNotificaciones = false" />
              </div>
            </transition>
          </div>
        </div>
      </nav>

      <!-- Menú desplegable (hamburguesa) -->
      <div v-if="menuAbierto" class="mt-4">
        <ul class="flex flex-col items-start space-y-2 pl-4">
          <li v-if="!isLoggedIn">
            <router-link to="/bienvenidos" class="text-black hover:text-cyan-400 font-medium">Bienvenidos</router-link>
          </li>
          <li v-if="!isLoggedIn">
            <router-link to="/login" class="text-black hover:text-cyan-400 font-medium">Iniciar sesión</router-link>
          </li>
          <li v-if="!isLoggedIn">
            <router-link to="/registro" class="text-black hover:text-cyan-400 font-medium">Registro</router-link>
          </li>

          <li v-if="isLoggedIn">
            <router-link to="/" class="text-black hover:text-cyan-400 font-medium">Comunidad</router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/crear-partido" class="text-black hover:text-cyan-400 font-medium">Crear
              partido</router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/partidos" class="text-black hover:text-cyan-400 font-medium">Partidos</router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/chat" class="text-black hover:text-cyan-400 font-medium">Chat público</router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/perfil" class="text-black hover:text-cyan-400 font-medium">Perfil</router-link>
          </li>
          <li v-if="isLoggedIn" @click="logout" class="text-black hover:text-cyan-400 font-medium cursor-pointer">Salir
          </li>
        </ul>
      </div>
    </div>

    <!-- Barra de navegación inferior para móviles y tabletas -->
    <div v-if="isLoggedIn && mostrarBarraInferior"
      class="lg:hidden fixed bottom-0 w-full bg-cyan-500 shadow-lg z-50 h-16">
      <div class="grid grid-cols-5 items-center text-center p-2">

        <!-- Inicio -->
        <router-link to="/" class="text-white flex flex-col items-center">
          <i class="fa-solid fa-house text-2xl"></i>
          <span class="text-sm mt-1">Inicio</span>
        </router-link>

        <!-- Partidos -->
        <router-link to="/partidos" class="text-white flex flex-col items-center">
          <i class="fa-solid fa-futbol text-2xl"></i>
          <span class="text-sm mt-1">Partidos</span>
        </router-link>

        <router-link to="/crear-partido" class="text-white flex flex-col items-center flex-1">
          <div class="bg-cyan-400 text-cyan-white rounded-lg p-4 shadow-md">
            <i class="fa-solid fa-plus text-2xl"></i>
          </div>
        </router-link>

        <!-- Chat Público -->
        <router-link to="/chat" class="text-white flex flex-col items-center">
          <i class="fa-solid fa-message text-2xl"></i>
          <span class="text-sm mt-1">Chat</span>
        </router-link>

        <!-- Perfil -->
        <router-link to="/perfil" class="text-white flex flex-col items-center">
          <i class="fa-solid fa-user text-2xl"></i>
          <span class="text-sm mt-1">Perfil</span>
        </router-link>
      </div>
    </div>

    <!-- Contenido -->
    <main class="container mx-auto mt-4 mb-16 pb-20">
      <router-view />
    </main>

    <!-- Footer, oculto solo en chat -->
    <footer v-if="!$route.path.includes('chat')" class="bg-cyan-500 text-white py-4 mt-8">
      <div class="container mx-auto text-center">
        <p>&copy; 2024 FABO - Fútbol, Amistad, Básquet, Otros</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
import Notificaciones from "@/components/Notificaciones.vue"; // Asegúrate de importar el componente

export default {
  data() {
    return {
      isLoggedIn: false,
      userEmail: "",
      menuAbierto: false,
      mostrarBarraInferior: true,
      mostrarNotificaciones: false,
    };
  },
  components: { Notificaciones },
  computed: {
    linkClass() {
      return (route) => {
        return this.$route.path === route
          ? "text-cyan-400 font-medium hover:text-cyan-500 transition border-b-4 border-cyan-400"
          : "text-black font-medium hover:text-cyan-400 transition";
      };
    },
  },
  watch: {
    $route(to, from) {
      this.menuAbierto = false;
      const rutasOcultas = ["/login", "/registro", "/bienvenidos"];
      this.mostrarBarraInferior = !rutasOcultas.includes(to.path);
    },
  },
  created() {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.isLoggedIn = true;
        this.userEmail = user.email;
      } else if (this.$route.path !== "/login" && this.$route.path !== "/registro") {
        this.$router.push("/login");
      }
    });
  },
  methods: {
    toggleNotificaciones() {
      this.mostrarNotificaciones = !this.mostrarNotificaciones;
    },
    async logout() {
      const auth = getAuth();
      await signOut(auth);
      this.isLoggedIn = false;
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
@import "tailwindcss/tailwind.css";

/* Animaciones para el modal de notificaciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  box-sizing: border-box;
}

main {
  align-content: center;
  min-height: 78.4vh;
  margin: 0;
}
</style>
