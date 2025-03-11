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

    <!-- Barra superior (tablet y móvil) -->
    <div class="lg:hidden relative">
      <nav class="bg-zinc-100 p-4 shadow">
        <div class="container flex justify-between items-center relative">
          <!-- Logo centrado -->
          <router-link to="/" class="flex-1 text-start">
            <img src="/img/logo.png" alt="FABO Logo" class="w-32 h-auto" />
          </router-link>

          <!-- Contenedor de iconos (campanita y cerrar sesión) -->
          <div v-if="isLoggedIn" class="flex items-center gap-2 absolute top-0 right-0">
            <!-- Notificaciones -->
            <div class="relative">
              <button @click="toggleNotificaciones"
                class="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-400 text-white hover:bg-blue-700 transition-transform transform hover:scale-110">
                <i class="fa-solid fa-bell fa-lg"></i>
              </button>

              <!-- Modal de Notificaciones con animación -->
              <transition name="fade">
                <div v-if="mostrarNotificaciones"
                  class="absolute top-full right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-50">
                  <Notificaciones @cerrar="mostrarNotificaciones = false" />
                </div>
              </transition>
            </div>

            <!-- Cerrar sesión -->
            <span @click="logout"
              class="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white hover:bg-red-900 transition-transform transform hover:scale-110 cursor-pointer">
              <i class="fa-solid fa-right-from-bracket fa-lg"></i>
            </span>
          </div>
        </div>
      </nav>
    </div>

    <!-- Barra de navegación inferior para móviles y tabletas -->
    <div v-if="isLoggedIn && mostrarBarraInferior" class="lg:hidden fixed bottom-0 w-full bg-cyan-500 shadow-lg z-50">
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
    <main class="container mx-auto mt-4 mb-8 pb-20">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-cyan-500 text-white py-6 hidden sm:block">
      <div class="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        <!-- Logo -->
        <div>
          <img src="/img/logo2.png" alt="FABO Logo" class="h-12">
        </div>

        <!-- Enlaces rápidos -->
        <div class="flex space-x-6 mt-0">
          <router-link v-if="!isLoggedIn" to="/bienvenidos" class="hover:underline">Bienvenidos</router-link>
          <router-link v-if="!isLoggedIn" to="/login" class="hover:underline">Login</router-link>
          <router-link v-if="!isLoggedIn" to="/registro" class="hover:underline">Registro</router-link>
          <router-link v-if="isLoggedIn" to="/" class="hover:underline">Publicaciones</router-link>
          <router-link v-if="isLoggedIn" to="/chat" class="hover:underline">chat</router-link>
          <router-link v-if="isLoggedIn" to="/partidos" class="hover:underline">partidos</router-link>
        </div>

        <!-- Redes sociales -->
        <div class="flex space-x-4 mt-0">
          <a href="https://www.facebook.com/" target="_blank" class="hover:text-gray-200"><i class="fab fa-facebook-f"></i></a>
          <a href="https://x.com/home" target="_blank" class="hover:text-gray-200"><i class="fab fa-twitter"></i></a>
          <a href="https://www.instagram.com" target="_blank" class="hover:text-gray-200"><i class="fab fa-instagram"></i></a>
        </div>
      </div>

      <!-- Copyright -->
      <div class="text-center text-sm mt-6 border-t border-white/20 pt-4">
        &copy; 2024 FABO - Fútbol, Amistad, Básquet, Otros. Todos los derechos reservados.
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
