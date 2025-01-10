<template>
  <div class="modal-overlay">
    <div class="modal-content bg-white rounded shadow p-4">
      <h1 class="text-2xl font-bold mb-4">Perfil de {{ publicacion.username || 'Cargando...' }}</h1>

      <!-- Imagen de perfil y datos del usuario -->
      <div class="flex items-center mb-4">
        <div class="perfil-imagen mr-4">
          <img v-if="publicacion.fotoPerfil" :src="publicacion.fotoPerfil" alt="Foto de perfil" class="rounded-full w-16 h-16 object-cover border-4 border-cyan-400 shadow-md">
          <p v-else class="text-gray-500">Sin foto de perfil</p>
        </div>
        <div>
          <p class="text-lg">Nombre: <span class="font-medium">{{ publicacion.username || 'Cargando...' }}</span></p>
          <p class="text-lg">Email: <span class="font-medium">{{ publicacion.email || 'Cargando...' }}</span></p>
        </div>
      </div>

      <!-- Botón para iniciar un chat privado con ícono de mensaje -->
      <button 
        @click="irAlChatPrivado" 
        class="border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-400 hover:text-white px-4 py-2 rounded mt-4 flex items-center transition"
      >
        <i class="fa-solid fa-message text-xl mr-2"></i> 
        Enviar mensaje
      </button>

      <!-- Botón para cerrar el modal -->
      <button @click="$emit('cerrar')" class=" mt-4 flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition text-xs sm:text-sm">Cerrar</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    publicacion: Object
  },
  methods: {
    irAlChatPrivado() {
      if (this.publicacion.userId && this.publicacion.username) {
        this.$router.push({ name: 'ChatPrivado', params: { destinatarioId: this.publicacion.userId, destinatarioNombre: this.publicacion.username } });
        this.$emit('cerrar'); // Cerrar el modal después de redirigir
      }
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  max-width: 500px;
  width: 100%;
}

button {
  cursor: pointer;
}

</style>
