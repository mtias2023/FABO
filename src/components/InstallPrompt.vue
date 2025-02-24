<template>
    <div v-if="deferredPrompt" class="fixed bottom-5 right-5 bg-white shadow-lg rounded-xl p-4 flex items-center space-x-3">
      <p class="text-gray-700">¿Quieres instalar nuestra app?</p>
      <button @click="installPWA" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
        Instalar
      </button>
      <button @click="closePrompt" class="text-gray-500 hover:text-gray-700"><i class="fa-solid fa-xmark"></i></button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const deferredPrompt = ref(null);
  
  onMounted(() => {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      console.log("llegue aca")
      deferredPrompt.value = event;
    });
  });
  
  const installPWA = async () => {
    if (deferredPrompt.value) {
      deferredPrompt.value.prompt();
      const { outcome } = await deferredPrompt.value.userChoice;
      if (outcome === 'accepted') {
        deferredPrompt.value = null;
      }
    }
  };
  
  const closePrompt = () => {
    deferredPrompt.value = null;
  };
  </script>
  