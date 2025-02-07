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
      <router-link v-if="isLoggedIn" to="/crear-partido" :class="linkClass('/crear-partido')">
        Crear Partido
      </router-link>
      <router-link v-if="isLoggedIn" to="/partidos" :class="linkClass('/partidos')">Partidos</router-link>
    </div>

    <!-- Contenedor de los iconos de perfil, chat, notificaciones y sesión -->
    <div class="flex space-x-3 items-center">
      <!-- Icono de perfil -->
      <router-link v-if="isLoggedIn" to="/perfil"
        class="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-400 text-white hover:bg-blue-700 transition">
        <i class="fa-solid fa-user fa-lg"></i>
      </router-link>

      <!-- Icono de chat público -->
      <router-link v-if="isLoggedIn" to="/chat"
        class="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-400 text-white hover:bg-blue-700 transition">
        <i class="fa-solid fa-message fa-lg"></i>
      </router-link>

      <!-- Sesiones de bienvenida y login solo si no está logueado -->
      <div v-if="!isLoggedIn" class="flex space-x-3">
        <router-link to="/bienvenidos" :class="linkClass('/bienvenidos')"
          class="text-black hover:text-cyan-400 cursor-pointer">Bienvenidos</router-link>
        <router-link to="/login" :class="linkClass('/login')"
          class="text-black hover:text-cyan-400 cursor-pointer">Iniciar Sesión</router-link>
        <router-link to="/registro" :class="linkClass('/registro')"
          class="text-black hover:text-cyan-400 cursor-pointer">Registro</router-link>
      </div>

      <!-- Icono de salir solo si está logueado -->
      <span v-if="isLoggedIn" @click="logout"
        class="text-black hover:text-cyan-400 cursor-pointer hover:scale-105 transition font-medium">
        Salir
      </span>
    </div>
  </div>
</nav>


    <!-- Menú hamburguesa (tablet y móvil) -->
    <div class="lg:hidden">
      <nav class="bg-zinc-100 p-4 shadow">
        <div class="container mx-auto flex items-center justify-between">
          <!-- Menú hamburguesa (Alineado a la izquierda) -->
          <button @click="menuAbierto = !menuAbierto"
            class="text-black focus:outline-none border-2 border-cyan-400 rounded-full  w-8 h-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          <!-- Logo centrado -->
          <router-link to="/" class="flex-1 text-center">
            <img src="/img/logo.png" alt="FABO Logo" class="w-32 h-auto mx-auto" />
          </router-link>
        </div>
      </nav>

      <!-- Menú desplegable (hamburguesa) -->
      <div v-if="menuAbierto" class="mt-4">
        <ul class="flex flex-col items-start space-y-2 pl-4">
          <!-- Opciones solo si no está logueado -->
          <li v-if="!isLoggedIn">
            <router-link to="/bienvenidos" :class="linkClass('/bienvenidos')"
              class="text-black hover:text-cyan-400 font-medium">Bienvenidos</router-link>
          </li>
          <li v-if="!isLoggedIn">
            <router-link to="/login" :class="linkClass('/login')"
              class="text-black hover:text-cyan-400 font-medium">Iniciar Sesión</router-link>
          </li>
          <li v-if="!isLoggedIn">
            <router-link to="/registro" :class="linkClass('/registro')"
              class="text-black hover:text-cyan-400 font-medium">Registro</router-link>
          </li>

          <!-- Opciones solo si está logueado -->
          <li v-if="isLoggedIn">
            <router-link to="/" :class="linkClass('/')">Comunidad</router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/crear-partido" :class="linkClass('/crear-partido')">Crear Partido</router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/partidos" :class="linkClass('/partidos')">Partidos</router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/chat" :class="linkClass('/chat')">Chat Público</router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/perfil" :class="linkClass('/perfil')">Perfil</router-link>
          </li>
          <li v-if="isLoggedIn" @click="logout" class="text-black hover:text-cyan-400 font-medium cursor-pointer">Salir
          </li>
        </ul>
      </div>
    </div>

  <!-- Barra de navegación inferior para móviles y tabletas -->
<div v-if="isLoggedIn && mostrarBarraInferior" class="lg:hidden fixed bottom-0 w-full bg-cyan-500 shadow-lg z-10">
  <div class="flex justify-between items-center p-2">

    <!-- Inicio -->
    <router-link to="/" class="text-white flex flex-col items-center flex-1">
      <i class="fa-solid fa-house text-2xl"></i>
      <span class="text-sm mt-2">Inicio</span>
    </router-link>

    <!-- Partidos -->
    <router-link to="/partidos" class="text-white flex flex-col items-center flex-1">
      <i class="fa-solid fa-futbol text-3xl"></i>
      <span class="text-sm mt-2">Partidos</span>
    </router-link>

    <!-- Crear Partido (Centrado y destacado) -->
    <router-link to="/crear-partido" class="text-white flex flex-col items-center flex-1">
      <div class="bg-cyan-400 text-cyan-white rounded-lg p-4 shadow-md">
        <i class="fa-solid fa-plus text-3xl"></i>
      </div>
    </router-link>

    <!-- Chat Público -->
    <router-link to="/chat" class="text-white flex flex-col items-center flex-1">
      <i class="fa-solid fa-message text-2xl"></i>
      <span class="text-sm mt-2">Chat</span>
    </router-link>

    <!-- Perfil -->
    <router-link to="/perfil" class="text-white flex flex-col items-center flex-1">
      <i class="fa-solid fa-user text-2xl"></i>
      <span class="text-sm mt-2">Perfil</span>
    </router-link>

  </div>
</div>


    <!-- Contenido -->
    <main class="container mx-auto mt-4 mb-16">
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

export default {
  data() {
    return {
      isLoggedIn: false,
      userEmail: "",
      menuAbierto: false,
      mostrarBarraInferior: true,
    };
  },
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
html, body {
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
