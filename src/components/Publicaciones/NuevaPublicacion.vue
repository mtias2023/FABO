<template>
  <div class="container mx-auto p-6 relative">
    <!-- Botón Volver en la esquina superior izquierda -->
    <button @click="cancelarCreacion"
      class="absolute top-10 left-1 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition flex items-center">
      <i class="fas fa-arrow-left md:mr-2"></i>
      <span class="hidden md:inline ml-2">Volver</span>
    </button>
    <h2 class="text-2xl text-cyan-500 font-bold mb-6 text-center">Crear nueva publicación</h2>

    <form @submit.prevent="crearPublicacion" class="bg-gray-100 p-8 rounded-lg shadow-lg">

      <!-- Campo de título -->
      <div class="mb-6 relative">
        <label for="titulo" class="absolute left-3 text-gray-500 text-sm transition-all duration-300 transform"
          :class="{ '-translate-y-6 text-blue-500': titulo }">
          Título
        </label>
        <input type="text" id="titulo" v-model="titulo" required
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

      <!-- Campo de imagen -->
      <div class="mb-6">
        <label class="block text-gray-700 font-semibold mb-2">Imagen:</label>

        <div class="relative w-full">
          <input type="file" @change="procesarImagen" accept="image/*" id="fileInput" ref="fileInput" class="hidden" />

          <label for="fileInput"
            class="flex items-center justify-center w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg cursor-pointer hover:bg-blue-600 transition-all duration-300">
            <span v-if="!fileName" class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
              </svg>
              Subir imagen
            </span>
            <span v-else>{{ fileName }}</span>
          </label>
        </div>
      </div>
      <!-- Botón Crear publicación -->
      <div class="flex justify-center md:justify-start mt-6">
        <button type="submit"
          class="bg-cyan-500 text-white font-semibold rounded-lg px-6 py-2 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-all duration-300">
          Crear publicación
        </button>
      </div>
    </form>
  </div>
</template>


<script>
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      titulo: "",
      contenido: "",
      imagen: null, // Variable para almacenar la imagen seleccionada
      fileName: "", // Nombre del archivo subido
    };
  },
  methods: {
    // Método para procesar la imagen seleccionada
    procesarImagen(event) {
      const file = event.target.files[0];
      if (file) {
        this.imagen = file; // Guarda la imagen seleccionada
        this.fileName = file.name; // Guarda el nombre del archivo
      } else {
        this.imagen = null;
        this.fileName = "";
      }
    },

    async crearPublicacion() {
      const db = getFirestore();
      const auth = getAuth();
      const storage = getStorage();
      const user = auth.currentUser;

      if (user) {
        try {
          let imagenURL = "";

          // Si el usuario sube una imagen, la subimos a Firebase Storage
          if (this.imagen) {
            const userId = user.uid;
            const storageRef = ref(storage, `publicaciones/${userId}/${this.imagen.name}`);
            const snapshot = await uploadBytes(storageRef, this.imagen);
            imagenURL = await getDownloadURL(snapshot.ref); // Obtén la URL de la imagen subida
          }

          // Guarda la publicación en Firestore con la URL de la imagen
          await addDoc(collection(db, "publicaciones"), {
            titulo: this.titulo,
            contenido: this.contenido,
            imagen: imagenURL,
            userId: user.uid,
            fotoPerfil: user.photoURL,
            username: user.displayName || "Usuario Anónimo",
            email: user.email,
            createdAt: new Date()
          });

          // Restablecer los campos del formulario
          this.titulo = "";
          this.contenido = "";
          this.imagen = null;
          this.fileName = ""; // Restablecer el nombre del archivo

          Swal.fire({
            icon: 'success',
            title: 'Publicación creada',
            text: '¡Tu publicación se ha creado exitosamente!',
          });

          // Redirigir a la lista de publicaciones
          this.$router.push({ name: 'ListaPublicaciones' });
        } catch (error) {
          console.error("Error al crear la publicación: ", error);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al crear la publicación. Por favor, inténtalo de nuevo.',
          });
        }
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'No autenticado',
          text: 'Debes iniciar sesión para crear una publicación.',
        });
      }
    },

    cancelarCreacion() {
      this.$router.push({ name: 'ListaPublicaciones' }); // Redirige a la lista de publicaciones
    }
  }
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

button {
  font-size: 1rem;
  text-transform: none;
  /* Cambiado para quitar las mayúsculas */
}

button:hover {
  transition: background-color 0.3s;
}

/* Media Query para pantallas móviles */
@media (max-width: 768px) {
  h2 {
    font-size: 1.6rem;
  }

  input,
  textarea {
    padding: 1rem;
  }

  button {
    padding: 0.8rem 1.2rem;
  }
}

@media (max-width: 480px) {
  h2 {
    font-size: 1.4rem;
  }

  input,
  textarea {
    padding: 0.8rem;
  }

  button {
    padding: 0.7rem 1rem;
  }
}
</style>
