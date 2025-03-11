<template>
  <!-- Botón Volver en la esquina superior izquierda -->

  <div class="container mx-auto p-6">
    <router-link to="/"
      class="absolute  bg-blue-500 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition flex items-center">
      <i class="fas fa-arrow-left md:mr-2"></i>
      <span class="hidden md:inline ml-2">Volver</span>
    </router-link>
    <h2 class="text-2xl text-cyan-500 font-bold mb-6">Editar publicación</h2>
    <form @submit.prevent="actualizarPublicacion" class="bg-gray-100 md:p-8 p-4 rounded-lg shadow-lg">

      <!-- Campo de título -->
      <div class="mb-6 relative">
        <label for="titulo" class="absolute left-3 text-gray-500 text-sm transition-all duration-300 transform"
          :class="{ '-translate-y-6 text-blue-500': titulo }">
          Título
        </label>
        <input type="text" v-model="titulo" required
          class="border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2 px-3 text-lg transition-all duration-300" />
      </div>

      <!-- Campo de contenido -->
      <div class="mb-6 relative">
        <label for="contenido" class="absolute left-3 text-gray-500 text-sm transition-all duration-300 transform"
          :class="{ '-translate-y-6 text-blue-500': contenido }">
          Contenido
        </label>
        <textarea v-model="contenido" id="contenido" required
          class="border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2 px-3 text-lg transition-all duration-300 resize-none"
          rows="5"></textarea>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-center space-x-4 mt-6 flex-wrap">
        <button type="submit"
          class="bg-blue-500 text-white font-semibold rounded-lg px-6 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300">
          Actualizar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      titulo: "",
      contenido: "",
      id: this.$route.params.id,
    };
  },
  created() {
    console.log("Cargando publicación con ID:", this.id);
    this.cargarPublicacion(this.id);
  },
  methods: {
    async cargarPublicacion(id) {
      const db = getFirestore();
      const docRef = doc(db, "publicaciones", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.titulo = docSnap.data().titulo;
        this.contenido = docSnap.data().contenido;
      } else {
        Swal.fire(
          '¡Error!',
          'No se encontró la publicación.',
          'error'
        );
      }
    },
    async actualizarPublicacion() {
      const db = getFirestore();
      const docRef = doc(db, "publicaciones", this.id);

      try {
        await updateDoc(docRef, {
          titulo: this.titulo,
          contenido: this.contenido,
        });
        Swal.fire(
          '¡Editada!',
          'Publicación actualizada exitosamente.',
          'success'
        );
        this.$router.push({ name: "ListaPublicaciones" });
      } catch (error) {
        Swal.fire(
          '¡Error!',
          'Error al actualizar la publicación: ' + error.message,
          'error'
        );
      }
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 900px;
}

h2 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold;
}

.bg-gray-100 {
  background-color: #f7fafc;
  border-radius: 12px;
}

input,
textarea {
  border-radius: 8px;
}

input:focus,
textarea:focus {
  outline: none;
  box-shadow: 0 2px 5px rgba(0, 123, 255, 0.2);
}

button,
.router-link {
  font-size: 1rem;
  text-transform: none;
  /* No mayúsculas */
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
}

button:hover,
.router-link:hover {
  transition: background-color 0.3s;
}

/* Media Query para pantallas móviles */
@media (max-width: 768px) {
  h2 {
    font-size: 1.5rem;
  }

  input,
  textarea {
    padding: 1rem;
  }

  button,
  .router-link {
    padding: 0.8rem 1.2rem;
  }
}

/* Media Query para pantallas más pequeñas */
@media (max-width: 480px) {
  h2 {
    font-size: 1.4rem;
    text-align: center;
  }

  input,
  textarea {
    padding: 0.8rem;
  }

  button,
  .router-link {
    padding: 0.7rem 1rem;
  }
}
</style>
