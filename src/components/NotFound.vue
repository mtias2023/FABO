<template>
  <div class="not-found p-4 text-center">
    <h1 class="text-3xl font-bold mb-4">404 - Página No Encontrada</h1>
    <p class="mt-2">Lo sentimos, la página que buscas no existe.</p>
    <router-link to="/" class="text-blue-500 underline hover:text-blue-700 transition-colors">Volver al inicio</router-link>
    <router-link to="/login" class="ml-4 text-blue-500 underline hover:text-blue-700 transition-colors">Iniciar Sesión</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
};
</script>

<style scoped>
.not-found {
  background-color: #f8fafc; 
  color: #1f2937; 
  border-radius: 8px; 
  padding: 20px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  margin: 20px; 
}
h1 {
  color: #e3342f; 
}
a {
  font-weight: 600; 
}
</style>
