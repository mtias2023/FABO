<template>
  <div class="container mx-auto p-4 sm:p-6 md:max-w-3xl lg:max-w-5xl">
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Comunidad Section -->
      <div class="w-full lg:w-2/3 flex flex-col mx-auto">
        <div class="comunidad p-4 sm:p-6 rounded-lg shadow-lg flex-grow">
          <router-link to="/nueva-publicacion"
            class="border border-cyan-400 text-white bg-cyan-500 rounded p-2 hover:bg-transparent hover:text-black transition text-sm sm:text-base">
            Crear nueva publicación
          </router-link>

          <div v-if="cargando">
            <Loader />
          </div>

          <!-- Mostrar las publicaciones solo cuando no se están cargando -->
          <div v-else>
            <div v-for="publicacion in publicaciones" :key="publicacion.id"
              class="mt-4 mb-4 sm:mb-6 p-4 sm:p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white">
              <!-- Publicación Content -->
              <div class="flex items-center justify-between mb-4 space-x-4">
                <!-- Información del Usuario -->
                <div class="flex items-center space-x-4 cursor-pointer" @click="abrirModalPerfil(publicacion)">
                  <img v-if="publicacion.fotoPerfil" :src="publicacion.fotoPerfil" alt="Foto de perfil del usuario"
                    class="rounded-full w-16 h-16 object-cover border-4 border-cyan-400 shadow-md"
                    @error="publicacion.fotoPerfil = '/img/user.png'" />
                  <div>
                    <p class="text-gray-800 font-semibold text-base sm:text-lg text-sm">
                      Por: <span class="text-cyan-600">{{ publicacion.username }}</span>
                    </p>
                    <p class="text-gray-500 text-xs sm:text-sm text-xs">{{ publicacion.email }}</p>
                  </div>
                </div>

                <!-- Ícono de Mensaje -->
                <i class="fa-solid fa-message text-xl sm:text-2xl text-cyan-500 cursor-pointer hover:text-cyan-400 transition"
                  @click="iniciarChatPrivado(publicacion.userId, publicacion.username)"></i>
              </div>

              <h3 class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 text-base sm:text-lg">{{
                publicacion.titulo }}</h3>
              <p class="text-gray-600 mb-4 text-xs sm:text-sm">{{ publicacion.contenido }}</p>

              <!-- Mostrar la fecha y hora -->
              <p class="text-slate-500 text-xs sm:text-sm">{{ publicacion.fechaHora }}</p>

              <div v-if="publicacion.imagen" class="mt-4 mb-4 flex">
                <img :src="publicacion.imagen" alt="Imagen de la publicación"
                  class="w-full h-auto rounded-lg shadow-md sm:w-full md:w-full lg:w-[500px] lg:h-[300px] object-cover">
              </div>

              <div class="flex items-center gap-2 mt-4" v-if="esPropietario(publicacion.userId)">
              <!-- Botón de Editar -->
              <button @click="editarPublicacion(publicacion.id)"
                class="flex items-center space-x-2 px-3 py-1 bg-amber-500 text-gray-800 rounded-md hover:bg-amber-400 transition text-xs sm:text-sm">
                <i class="fa-solid fa-pen-to-square text-lg"></i>
                <span>Editar</span>
              </button>

              <!-- Botón de Eliminar -->
              <button @click="eliminarPublicacion(publicacion.id)"
                class="flex items-center space-x-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-500 transition text-xs sm:text-sm">
                <i class="fa-solid fa-trash text-lg"></i>
                <span>Eliminar</span>
              </button>
            </div>


              <Comentarios :publicacionId="publicacion.id" class="mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Perfil -->
    <ModalPerfil v-if="mostrarModalPerfil" :publicacion="publicacionSeleccionada"
      @cerrar="mostrarModalPerfil = false" />
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage"; // Importar Storage de Firebase
import Comentarios from '../Comentarios.vue';
import ModalPerfil from '../ModalPerfil.vue'; // Importar el componente ModalPerfil
import Loader from '../Loader.vue'; // Importar el componente Loader

export default {
  components: { Comentarios, ModalPerfil, Loader },
  data() {
    return {
      publicaciones: [],
      userId: null,
      mostrarModalPerfil: false,
      publicacionSeleccionada: null,
      cargando: true, // Variable para manejar el estado de carga
    };
  },
  async mounted() {
    await this.obtenerPublicaciones();
    await this.obtenerUsuario();
  },
  methods: {
    async obtenerPublicaciones() {
      const db = getFirestore();
      const publicacionesSnapshot = await getDocs(collection(db, "publicaciones"));
      this.publicaciones = await Promise.all(publicacionesSnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        let fotoPerfil = data.fotoPerfil || "/img/user.png";
        if (fotoPerfil && !fotoPerfil.startsWith("http")) {
          try {
            const fotoRef = ref(storage, fotoPerfil);
            fotoPerfil = await getDownloadURL(fotoRef);
          } catch (error) {
            console.error("Error al obtener la foto de perfil:", error);
          }
        }
        // Formatear la fecha
        const fechaHora = this.formatFechaHora(data.createdAt.toDate());
        return { id: docSnapshot.id, ...data, fotoPerfil, fechaHora, createdAt: data.createdAt };
      }));

      // Ordenar publicaciones por fecha de creación (descendente)
      this.publicaciones.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

      this.cargando = false;
    }
    ,
    async obtenerUsuario() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        this.isLoggedIn = false;
        return;
      }

      this.isLoggedIn = true;
      this.userId = user.uid;
      this.username = user.displayName || "Username";

      if (user.photoURL) {
        try {
          const storage = getStorage();
          const fotoRef = ref(storage, user.photoURL);
          this.fotoPerfil = await getDownloadURL(fotoRef);
        } catch (error) {
          console.error("Error al cargar la foto de perfil:", error);
          this.fotoPerfil = "/img/user.png";
        }
      }
    },
    esPropietario(publicacionUserId) {
      return this.userId === publicacionUserId;
    },
    editarPublicacion(publicacionId) {
      this.$router.push({ name: 'EditarPublicacion', params: { id: publicacionId } });
    },
    async eliminarPublicacion(publicacionId) {
      try {
        const resultado = await Swal.fire({
          title: '¿Estás seguro?',
          text: '¡Esta acción no se puede deshacer!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        });

        if (resultado.isConfirmed) {
          const db = getFirestore();
          await deleteDoc(doc(db, "publicaciones", publicacionId));

          Swal.fire(
            '¡Eliminado!',
            'La publicación ha sido eliminada.',
            'success'
          );

          // Actualiza la lista de publicaciones
          await this.obtenerPublicaciones();
        }
      } catch (error) {
        console.error("Error al eliminar la publicación: ", error);
        Swal.fire(
          'Error',
          'Hubo un problema al eliminar la publicación. Inténtalo de nuevo.',
          'error'
        );
      }
    },

    iniciarChatPrivado(destinatarioId, destinatarioNombre) {
      this.$router.push({ name: 'ChatPrivado', params: { destinatarioId, destinatarioNombre } });
    },
    abrirModalPerfil(publicacion) {
      this.publicacionSeleccionada = publicacion;
      this.mostrarModalPerfil = true;
    },

    // Función para formatear la fecha y hora
    formatFechaHora(fecha) {
      const opcionesFecha = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
      const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: true };
      const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
      const horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora);
      return `${fechaFormateada}, ${horaFormateada}`;
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 100%;
}

.comunidad {
  background-color: #f7fafc;
  border-radius: 12px;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #282828;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.05em;
}

h3 {
  font-size: 1.4rem;
  color: #111827;
}

img {
  max-width: 100%;
}

.text-cyan-600 {
  color: #0891B2;
}

@media (max-width: 1024px) {
  .lg\:max-w-5xl {
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .text-lg {
    font-size: 1.5rem;
  }

  .text-base {
    font-size: 0.950rem;
  }

  .text-sm {
    font-size: 0.90rem;
  }

  .p-4 {
    padding: 0.90rem;
  }

  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .py-2 {
    padding-top: 0.8rem;
    padding-bottom: 0.8rem;
  }
}
</style>
