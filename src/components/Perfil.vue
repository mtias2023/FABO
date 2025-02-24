<template>
  <div class="fondo-perfil mx-auto py-8">
    <div class="perfil p-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-2xl sm:text-xl font-bold mb-6 text-cyan-500">Perfil de usuario</h1>

      <Loader v-if="cargando" />

      <div v-else>
        <!-- Contenedor de imagen de perfil y datos del usuario -->
        <div class="flex flex-col md:flex-row items-center justify-start mb-6">
          <div class="perfil-imagen mr-4 mb-4 md:mb-0">
            <img v-if="userPhotoURL" :src="userPhotoURL" alt="Foto de perfil"
              class="rounded-full w-24 h-24 object-cover border-4 border-cyan-400 shadow-md">
            <p v-else class="text-gray-500 text-sm">Sin foto de perfil</p>
          </div>
          <div>
            <p class="text-lg sm:text-base text-gray-700">Nombre: <span class="font-semibold">{{ userName }}</span></p>
            <p class="text-lg sm:text-base text-gray-700">Email: <span class="font-semibold">{{ userEmail }}</span></p>
          </div>
        </div>

        <button @click="toggleEditar"
          class="border border-cyan-400 text-white bg-cyan-500 rounded p-3 hover:bg-transparent hover:text-black transition px-4 py-2 sm:px-4 sm:py-2 sm:text-base">
          <i class="fa fa-edit mr-2"></i>
          {{ mostrarFormulario ? 'Cancelar Edición' : 'Editar Perfil' }}
        </button>

        <div v-if="mostrarFormulario" class="mt-6 bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 class="text-x2 sm:text-lg font-semibold mb-4 text-center text-cyan-500">Editar Perfil</h2>
          <form @submit.prevent="actualizarDatos">
            <div class="mb-4">
              <label for="nombre" class="block text-sm sm:text-base font-medium text-gray-700">Nuevo Nombre:</label>
              <input v-model="newName" type="text" id="nombre"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-400">
            </div>

            <!-- Input para la imagen de perfil -->
            <div class="mb-4">
              <label for="foto" class="block text-sm sm:text-base font-medium text-gray-700">Nueva Foto de Perfil:</label>
              <input type="file" @change="onFileChange" id="foto"
                class="mt-1 block w-full text-sm sm:text-base focus:outline-none">
            </div>

            <button type="submit"
              class="bg-cyan-400 text-white px-4 py-2 rounded-full hover:bg-blue-600 text-sm sm:text-base w-auto mx-auto ">
              Guardar Cambios
            </button>
          </form>
        </div>

        <!-- Sección para completar el perfil con encuesta -->
        <button v-if="!perfilCompleto" @click="mostrarModal = true"
          class="border border-blue-500 text-white bg-blue-600 rounded p-3 hover:bg-transparent hover:text-black transition px-4 py-2 sm:px-4 sm:py-2 sm:text-base mt-4 mx-4">
          Completar perfil
        </button>



        <!-- Modal Encuesta -->
        <div v-if="mostrarModal" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 class="text-xl font-semibold text-cyan-500 mb-4">Completa tu perfil</h2>
            <form @submit.prevent="guardarEncuesta">
              <div class="mb-4">
                <label for="deporte" class="block text-sm sm:text-base font-medium text-gray-700">Deporte favorito:</label>
                <input v-model="encuesta.deporte" type="text" id="deporte" required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-400">
              </div>
              <div class="mb-4">
                <label for="nivel" class="block text-sm sm:text-base font-medium text-gray-700">Nivel de juego:</label>
                <input v-model="encuesta.nivel" type="text" id="nivel" required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-400">
              </div>
              <div class="mb-4">
                <label for="posicion" class="block text-sm sm:text-base font-medium text-gray-700">Posición en el deporte:</label>
                <input v-model="encuesta.posicion" type="text" id="posicion" required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-400">
              </div>
              <div class="mb-4">
                <label for="descripcion" class="block text-sm sm:text-base font-medium text-gray-700">Descripción personal:</label>
                <textarea v-model="encuesta.descripcion" id="descripcion" required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-400"></textarea>
              </div>

              <button type="submit"
                class="bg-cyan-400 text-white px-4 py-2 rounded-full hover:bg-blue-600 text-sm sm:text-base w-auto mx-auto ">
                Guardar respuestas
              </button>
            </form>
            <button @click="mostrarModal = false"
              class="mt-4 text-red-500 font-semibold hover:underline">Cerrar</button>
          </div>
        </div>

        <!-- Mostrar respuestas de la encuesta si ya han sido guardadas -->
        <div class="mt-6">
          <h2 class="text-xl sm:text-lg font-semibold text-cyan-500 mb-4">Información del perfil</h2>
        <div v-if="encuestaGuardada" class="mt-6 mb-6 p-6 border border-gray-200 rounded-lg shadow-md text-sm sm:text-base hover:shadow-xl transition">
          <p><strong>Deporte favorito:</strong> {{ encuesta.deporte }}</p>
          <p><strong>Nivel de juego:</strong> {{ encuesta.nivel }}</p>
          <p><strong>Posición:</strong> {{ encuesta.posicion }}</p>
          <p><strong>Descripción:</strong> {{ encuesta.descripcion }}</p>
          <button @click="mostrarModal = true"
            class="mt-4 text-cyan-500 font-semibold hover:underline">Editar respuestas</button>
        </div>
      </div>
    </div>

      <div class="mt-6">
        <h2 class="text-xl sm:text-lg font-semibold mb-4 text-cyan-500">Mis publicaciones</h2>
        <div v-for="publicacion in publicaciones" :key="publicacion.id"
          class="mb-6 p-6 border border-gray-200 rounded-lg shadow-md text-sm sm:text-base hover:shadow-xl transition">
          <h3 class="text-lg sm:text-base font-semibold">{{ publicacion.titulo }}</h3>
          <p class="text-gray-700 text-sm sm:text-base">{{ publicacion.contenido }}</p>
          <img v-if="publicacion.imagenUrl" :src="publicacion.imagenUrl" alt="Imagen de la publicación"
            class="mt-2 w-full h-auto rounded-md">
        </div>
      </div>

      <router-link to="/" class="text-amber-500 font-semibold hover:underline mt-5 text-sm sm:text-base">Volver a la
        página principal</router-link>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { getAuth, updateProfile, updatePassword } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Loader from './Loader.vue';

export default {
  components: {
    Loader
  },
  data() {
    return {
      userName: '',
      userEmail: '',
      userPhotoURL: '',
      newName: '',
      newPhoto: null,
      publicaciones: [],
      mostrarFormulario: false,
      cargando: false,
      encuesta: {
        deporte: '',
        nivel: '',
        posicion: '',
        descripcion: ''
      },
      encuestaGuardada: false,
      mostrarModal: false,
      perfilCompleto: false // Nueva propiedad para controlar la visibilidad del botón
    };
  },
  async mounted() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      this.userName = user.displayName || "Sin nombre";
      this.userEmail = user.email;
      this.userPhotoURL = user.photoURL;
      this.newName = user.displayName;
      await this.obtenerMisPublicaciones(user.uid);
      await this.obtenerEncuesta(user.uid); // Verifica si ya completó la encuesta
    }
  },
  methods: {
    toggleEditar() {
      this.mostrarFormulario = !this.mostrarFormulario;
    },
    async obtenerMisPublicaciones(uid) {
      const db = getFirestore();
      const publicacionesRef = collection(db, "publicaciones");
      const q = query(publicacionesRef, where("userId", "==", uid));
      const publicacionesSnapshot = await getDocs(q);
      this.publicaciones = publicacionesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    async obtenerEncuesta(uid) {
      const db = getFirestore();
      const encuestaRef = doc(db, "encuestas", uid);
      const encuestaDoc = await getDoc(encuestaRef);

      if (encuestaDoc.exists()) {
        this.encuesta = encuestaDoc.data();
        this.encuestaGuardada = true;
        this.perfilCompleto = true; // Oculta el botón si ya completó la encuesta
      }
    },
    onFileChange(event) {
      this.newPhoto = event.target.files[0];
    },
    async actualizarDatos() {
      this.cargando = true;
      const auth = getAuth();
      const user = auth.currentUser;
      const updates = {};

      try {
        if (this.newName && this.newName !== user.displayName) {
          updates.displayName = this.newName;
        }

        if (this.newPhoto) {
          const storage = getStorage();
          const storageRef = ref(storage, `perfil/${user.uid}/${this.newPhoto.name}`);
          await uploadBytes(storageRef, this.newPhoto);
          updates.photoURL = await getDownloadURL(storageRef);
        }

        await updateProfile(user, updates);
        this.userName = updates.displayName || this.userName;
        this.userPhotoURL = updates.photoURL || this.userPhotoURL;

        this.mostrarFormulario = false;

        Swal.fire({
          title: '¡Perfil actualizado!',
          text: 'Los cambios se guardaron correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          timer: 3000
        });

      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: `No se pudo actualizar el perfil: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      } finally {
        this.cargando = false;
      }
    },
    async guardarEncuesta() {
      const auth = getAuth();
      const user = auth.currentUser;
      const db = getFirestore();
      const encuestaRef = doc(db, "encuestas", user.uid);

      try {
        await setDoc(encuestaRef, this.encuesta);
        this.encuestaGuardada = true;
        this.perfilCompleto = true; // Oculta el botón después de guardar
        this.mostrarModal = false;

        Swal.fire({
          title: '¡Perfil completado!',
          text: 'Gracias por completar tu perfil.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          timer: 3000
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: `No se pudo guardar la encuesta: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    }
  }
};
</script>



<style scoped>
.fondo-perfil{
  max-width: 800px; 
  background-color: #f7fafc;
  box-shadow: 0px 4px 10px rgba(202, 240, 251, 0.3);
  padding: 2rem; 
  border-radius: 0.5rem;
  border-radius: 14px;
}
.perfil {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(201, 243, 254, 0.3); 
  border-radius: 0.5rem; 
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.perfil-imagen img {
  display: block;
  margin-bottom: 15px;
}

h1 {
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
  font-weight: bold;

}

h2 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: bold;

}

button {
  border-radius: 6px;
}

@media (max-width: 768px) {
  .perfil-imagen {
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
  }

  h1 {
    font-size: 1.5rem;
  }
  
h2 {
  font-size: 1.2rem;
}

  button {
    width: auto;
  }
}
</style>
