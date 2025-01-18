self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/img/icono-universo.png',
        '/style.css',
        '/main.js', // Si tu JS principal es estático
        '/login', 
        '/registro',
        '/bienvenidos',
        '/nueva-publicacion',
        '/editar-publicacion/:id',
        '/perfil',
        '/chat-privado/:destinatarioId/:destinatarioNombre?',
        '/crear-partido',
        '/partidos',
        '/partido/:id/jugadores',
        '/chat',
        '/not-found', // La ruta de tu página NotFound
        // Agregar otras rutas estáticas necesarias
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
