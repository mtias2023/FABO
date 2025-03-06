<template>
  <div class="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 transition-opacity">
    <div class="modal-content relative bg-white rounded-lg shadow-lg p-6 w-full max-w-sm sm:max-w-lg max-h-[90vh] overflow-y-auto animate-fadeIn">
      
      <!-- Botón para cerrar el modal -->
      <button @click="$emit('cerrar')"
        class="absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-red-500 hover:text-white transition duration-300 shadow-md">
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>

      <!-- Imagen de perfil y datos del usuario -->
      <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div class="perfil-imagen">
          <img v-if="publicacion.fotoPerfil" :src="publicacion.fotoPerfil" alt="Foto de perfil"
            class="rounded-full w-24 h-24 object-cover border-4 border-cyan-400 shadow-md">
          <p v-else class="text-gray-500">Sin foto de perfil</p>
        </div>
        <div class="text-center sm:text-left">
          <p class="text-lg font-semibold text-gray-800">{{ publicacion.username || 'Cargando...' }}</p>
          <p class="text-gray-600 text-sm">{{ publicacion.email || 'Cargando...' }}</p>
        </div>
      </div>

      <!-- Datos de la encuesta -->
      <h3 class="text-lg font-semibold text-gray-700 mt-4 mb-1">Detalles del perfil</h3>
      <div v-if="encuesta" class="bg-cyan-100 p-4 rounded-lg shadow-md mb-4 border border-cyan-200">  
        <div class="grid grid-cols-2 gap-3 text-gray-700">
          <p><span class="font-medium">Deporte favorito:</span> {{ encuesta.deporte }}</p>
          <p><span class="font-medium">Nivel:</span> {{ encuesta.nivel }}</p>
          <p><span class="font-medium">Posición:</span> {{ encuesta.posicion }}</p>
        </div>
        <p class="mt-3 italic text-gray-600">{{ encuesta.descripcion }}</p>
      </div>
      <p v-else class="text-gray-500 mt-4 mb-4 text-center">No hay datos disponibles.</p>

      <!-- Botón para iniciar un chat privado -->
      <button @click="irAlChatPrivado"
        class="border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white px-4 py-2 rounded flex items-center justify-center transition w-full sm:w-auto shadow-md">
        <i class="fa-solid fa-message text-xl mr-2"></i>
        Enviar mensaje
      </button>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export default {
  props: {
    publicacion: Object
  },
  data() {
    return {
      encuesta: null, // Aquí guardaremos la información de la encuesta
    };
  },
  async created() {
    if (this.publicacion.userId) {
      await this.obtenerEncuesta(this.publicacion.userId);
    }
  },
  methods: {
    async obtenerEncuesta(userId) {
      try {
        const docRef = doc(db, "encuestas", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.encuesta = docSnap.data();
        } else {
          console.log("No se encontraron datos de encuesta.");
        }
      } catch (error) {
        console.error("Error obteniendo encuesta:", error);
      }
    },
    irAlChatPrivado() {
      if (this.publicacion.userId && this.publicacion.username) {
        this.$router.push({ name: "ChatPrivado", params: { destinatarioId: this.publicacion.userId, destinatarioNombre: this.publicacion.username } });
        this.$emit("cerrar");
      }
    }
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
