<template>
  <div
    class="login-container flex flex-col lg:flex-row items-center justify-center p-6 bg-white shadow-lg rounded-lg mx-auto max-w-4xl mt-10">
    <!-- Formulario de login -->
    <div class="login-form w-full lg:w-1/2 p-6">
      <h2 class="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
      <form @submit.prevent="login" class="space-y-4">
        <!-- Loader -->
        <div v-if="cargando" class="flex justify-center items-center">
          <Loader />
        </div>

        <!-- Formulario -->
        <div v-else>
          <div class="mb-4">
            <label for="email" class="block text-gray-700">Email</label>
            <input type="email" v-model="email" id="email" placeholder="Introduce tu email"
              class="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div class="mb-4 relative">
            <label for="password" class="block text-gray-700">Contraseña</label>
            <div class="relative">
              <input :type="mostrarPassword ? 'text' : 'password'" v-model="password" id="password"
                placeholder="Introduce tu contraseña"
                class="border rounded w-full h-12 pr-12 pl-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required />
              <button type="button" @click="toggleMostrarPassword"
                class="absolute inset-y-2 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-cyan-500 hover:text-white transition duration-300 shadow-md">
                <i :class="mostrarPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
              </button>
            </div>
          </div>

          <button type="submit"
            class="border border-cyan-400 text-white bg-cyan-400 rounded p-2 hover:bg-transparent hover:text-black transition p-2 w-full">
            Iniciar Sesión
          </button>
        </div>
      </form>

      <p class="mt-4 text-center">
        ¿No tenes una cuenta?
        <router-link to="/registro" class="text-blue-500 font-semibold">Regístrate aca</router-link>
      </p>
      <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
    </div>

    <!-- Imagen (a la derecha en pantallas grandes) -->
    <div class="w-full lg:w-1/2 mb-4 lg:mb-0 flex justify-center lg:justify-end">
      <img src="/img/login-imagen.png" alt="Imagen de inicio de sesión" class="w-full h-auto rounded-lg shadow-md" />
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";
import Swal from "sweetalert2";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default {
  components: {
    Loader,
  },
  data() {
    return {
      email: "",
      password: "",
      mostrarPassword: false,
      errorMessage: "",
      cargando: false,
    };
  },
  methods: {
    async login() {
      const auth = getAuth();
      this.errorMessage = "";
      this.cargando = true;
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);

        Swal.fire({
          title: "¡Inicio de sesión exitoso!",
          text: "Has iniciado sesión correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
          timer: 3000,
        });

        this.$router.push("/"); // Redirige a la página principal
      } catch (error) {
        this.errorMessage = "Error al iniciar sesión: " + error.message;

        Swal.fire({
          title: "Error",
          text: this.errorMessage,
          icon: "error",
          confirmButtonText: "Intentar de nuevo",
        });
      } finally {
        this.cargando = false;
      }
    },
    toggleMostrarPassword() {
      this.mostrarPassword = !this.mostrarPassword;
    },
  },
};
</script>

<style scoped>
.login-container {
  background-color: #f9fafb;
}

img {
  object-fit: cover;
}
</style>
