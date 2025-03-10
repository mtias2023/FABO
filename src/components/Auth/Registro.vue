<template>
  <div
    class="registro-container flex flex-col lg:flex-row items-center justify-center p-6 bg-white shadow-lg rounded-lg mx-auto max-w-4xl mt-10">
    <!-- Formulario -->
    <div class="registro-form w-full lg:w-1/2 p-6">
      <h2 class="text-2xl font-bold mb-6 text-center">Registro</h2>
      <!-- Loader -->
      <div v-if="cargando" class="flex justify-center items-center">
        <Loader />
      </div>

      <!-- Formulario -->
      <div v-else>
        <ErrorMessage v-if="errorMessage" :message="errorMessage" @clear="errorMessage = ''" />
        <form @submit.prevent="register" class="space-y-4">
          <div>
            <label for="name" class="block text-gray-700">Nombre</label>
            <input type="text" v-model="name" id="name" placeholder="Introduce tu nombre"
              class="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label for="email" class="block text-gray-700">Email</label>
            <input type="email" v-model="email" id="email" placeholder="Introduce tu email"
              class="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
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
            Registrarse
          </button>
        </form>
        <p class="mt-4 text-center">
          ¿Ya tenes una cuenta?
          <router-link to="/login" class="text-blue-500 font-semibold">Inicia sesión aca</router-link>
        </p>
      </div>
    </div>

    <!-- Imagen -->
    <div class="w-full lg:w-1/2 flex justify-center">
      <img src="/img/login-imagen.png" alt="Imagen de registro" class="w-full h-auto rounded-lg shadow-md" />
    </div>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Swal from "sweetalert2";
import ErrorMessage from "./ErrorMessage.vue";
import Loader from "@/components/Loader.vue";

export default {
  components: { ErrorMessage, Loader },
  data() {
    return {
      name: "",
      email: "",
      password: "",
      mostrarPassword: false, // Nuevo estado para mostrar/ocultar contraseña
      errorMessage: "",
      cargando: false, // Estado de carga
    };
  },
  methods: {
    toggleMostrarPassword() {
      this.mostrarPassword = !this.mostrarPassword;
    },
    async register() {
      const auth = getAuth();
      this.errorMessage = "";
      this.cargando = true;

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        // Actualiza el perfil del usuario para agregar su nombre
        await updateProfile(user, { displayName: this.name });

        // Mensaje de éxito con SweetAlert
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "¡Tu cuenta ha sido creada correctamente!",
        });

        this.$router.push("/login");
      } catch (error) {
        this.errorMessage = error.message;
        Swal.fire({
          icon: "error",
          title: "Error en el registro",
          text: this.errorMessage,
        });
      } finally {
        this.cargando = false;
      }
    },
  },
};
</script>


<style scoped>
.registro-container {
  background-color: #f9fafb;
}

img {
  object-fit: cover;
}
</style>
