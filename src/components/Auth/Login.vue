<template>
  <div class="login-container flex flex-col lg:flex-row items-center justify-center p-6 bg-white shadow-lg rounded-lg mx-auto max-w-4xl mt-10">
    <!-- Formulario de login -->
    <div class="login-form w-full lg:w-1/2 p-6">
      <h2 class="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
      <form @submit.prevent="login" class="space-y-4">
        <!-- Loader -->
        <div v-if="cargando" class="flex justify-center items-center">
          <Loader />
        </div>

        <!-- Formulario -->
        <div v-else>
          <div class="mb-4">
            <label for="email" class="block text-gray-700">Email</label>
            <input
              type="email"
              v-model="email"
              id="email"
              placeholder="Introduce tu email"
              class="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-gray-700">Contraseña</label>
            <input
              type="password"
              v-model="password"
              id="password"
              placeholder="Introduce tu contraseña"
              class="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            class="border border-cyan-400 text-white bg-cyan-400 rounded p-2 hover:bg-transparent hover:text-black transition p-2 w-full"
          >
            Iniciar Sesión
          </button>
        </div>
      </form>
      <p class="mt-4 text-center">
        ¿No tienes una cuenta?
        <router-link to="/registro" class="text-blue-500 font-semibold">Regístrate aquí</router-link>
      </p>
      <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
    </div>

    <!-- Imagen (a la derecha en pantallas grandes) -->
    <div class="w-full lg:w-1/2 mb-4 lg:mb-0 flex justify-center lg:justify-end">
      <img
        src="/img/login-imagen.png"
        alt="Imagen de inicio de sesión"
        class="w-full h-auto rounded-lg shadow-md"
      />
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
