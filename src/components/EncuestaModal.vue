<template>
  <div v-if="isVisible" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-2xl font-bold text-center text-cyan-500 mb-4">Completa tu perfil</h2>

      <form @submit.prevent="submitEncuesta">
        <div class="mb-4">
          <label for="deporte" class="block text-sm font-medium text-gray-700">Deporte favorito:</label>
          <input v-model="deporte" id="deporte" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400" required>
        </div>

        <div class="mb-4">
          <label for="nivel" class="block text-sm font-medium text-gray-700">Nivel de juego:</label>
          <input v-model="nivel" id="nivel" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400" required>
        </div>

        <div class="mb-4">
          <label for="posicion" class="block text-sm font-medium text-gray-700">Posición en el deporte:</label>
          <input v-model="posicion" id="posicion" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400" required>
        </div>

        <div class="mb-4">
          <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción personal:</label>
          <textarea v-model="descripcion" id="descripcion" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400" required></textarea>
        </div>

        <div class="flex justify-between">
          <button type="submit" class="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600">Guardar</button>
          <button type="button" @click="cancelar" class="text-gray-500 px-4 py-2 rounded-md hover:bg-gray-200">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
    closeModal: Function,
    saveEncuesta: Function,
  },
  data() {
    return {
      deporte: '',
      nivel: '',
      posicion: '',
      descripcion: '',
    };
  },
  methods: {
    submitEncuesta() {
      const respuesta = {
        deporte: this.deporte,
        nivel: this.nivel,
        posicion: this.posicion,
        descripcion: this.descripcion,
      };
      this.saveEncuesta(respuesta);
      this.closeModal();
    },
    cancelar() {
      this.closeModal();
    }
  }
};
</script>
