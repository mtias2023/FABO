<template>
  <section 
    class="bienvenidos mt-8 p-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg shadow-lg flex flex-col lg:flex-row items-center lg:items-start animate__animated animate__fadeIn animate__delay-1s"
  >
    <!-- Contenedor de texto -->
    <div class="text-container lg:w-1/2 mb-6 lg:mb-0 lg:pr-6 text-center lg:text-left">
      <h1 class="text-3xl lg:text-4xl font-bold mb-6 hover:text-blue-600 transition duration-300 ease-in-out">
        Bienvenidos a FABO 
      </h1>
      <p class="text-gray-200 text-base lg:text-lg leading-relaxed">
        FABO es una comunidad diseñada para los amantes del fútbol, básquet y tenis. Aquí puedes conectar con otros usuarios, formar equipos, organizar partidos. También puedes participar en eventos, descubrir partidos cercanos y compartir tus logros deportivos.
        <br>
        <br>FABO es el espacio ideal para disfrutar del deporte, ampliar tu red de contactos y vivir experiencias únicas junto a otros apasionados del deporte.
      </p>
      <!-- Botón de llamada a la acción -->
      <div class="mt-6">
        <router-link 
          to="/registro" 
          class="inline-block px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-cyan-600 transition duration-300 transform hover:scale-105">
          Únete ahora
        </router-link>
      </div>
    </div>

    <!-- Imagen -->
    <div class="image-container lg:w-1/2 w-full">
      <img
        src="/img/banner-fabo.jpeg"
        alt="Banner FABO"
        class="w-full h-auto rounded-lg shadow-lg filter "
      />
    </div>
  </section>
</template>

<script>
export default {
  name: "Bienvenidos",
};
</script>

<style scoped>
/* Estilos generales */
.bienvenidos {
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 2rem;
}

.image-container img {
  object-fit: cover;
}

/* Añadir animación y efectos de transición */
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');
</style>
