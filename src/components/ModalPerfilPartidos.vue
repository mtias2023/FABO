<template>
    <div v-if="mostrar"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 transition-opacity">
        <div
            class="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-sm sm:max-w-lg max-h-[90vh] overflow-y-auto animate-fadeIn">

            <!-- Botón de cierre -->
            <button @click="cerrarModal"
                class="absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-red-500 hover:text-white transition duration-300 shadow-md">
                <i class="fa-solid fa-xmark text-lg"></i>
            </button>

            <!-- Imagen de perfil y datos del jugador -->
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div>
                    <img v-if="jugador.fotoPerfil" :src="jugador.fotoPerfil" alt="Foto de perfil"
                        class="rounded-full w-24 h-24 object-cover border-4 border-cyan-400 shadow-md">
                    <p v-else class="text-gray-500">Sin foto de perfil</p>
                </div>
                <div class="text-center sm:text-left">
                    <p class="text-lg font-semibold text-gray-800">{{ jugador.nombre || 'Cargando...' }}</p>
                    <p class="text-gray-600 text-sm">{{ jugador.email || 'Cargando...' }}</p>
                </div>
            </div>

            <!-- Detalles de la encuesta -->
            <h3 class="text-lg font-semibold text-gray-700 mt-4 mb-1">Detalles del perfil</h3>
            <div v-if="encuesta" class="bg-cyan-100 p-4 rounded-lg shadow-md mb-4 border border-cyan-200">
                <div class="grid grid-cols-2 gap-3 text-gray-700">
                    <p><span class="font-medium">Deporte favorito:</span> {{ encuesta.deporte }}</p>
                    <p><span class="font-medium">Nivel:</span> {{ encuesta.nivel }}</p>
                    <p><span class="font-medium">Posición:</span> {{ encuesta.posicion }}</p>
                </div>
                <p class="mt-3 text-gray-600">{{ encuesta.descripcion }}</p>
            </div>
            <p v-else class="text-gray-500 mt-4 mb-4 text-center">No hay datos disponibles.</p>

            <!-- Botón para iniciar chat -->
            <button @click="irAlChatPrivado"
                class="border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white px-4 py-2 rounded flex items-center justify-center transition w-full sm:w-auto shadow-md">
                <i class="fa-solid fa-message text-xl mr-2"></i>
                Enviar mensaje
            </button>
        </div>
    </div>
</template>

<script>
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default {
    props: {
        jugador: Object,
        mostrar: Boolean
    },
    data() {
        return {
            encuesta: null
        };
    },
    emits: ['cerrar'],
    methods: {
        cerrarModal() {
            this.$emit('cerrar');
        },
        async obtenerDatosEncuesta() {
            if (!this.jugador || !this.jugador.uid) return;

            // Restablecer la encuesta antes de cargar los nuevos datos
            this.encuesta = null;

            try {
                const db = getFirestore();
                const encuestaRef = doc(db, "encuestas", this.jugador.uid);
                const encuestaSnap = await getDoc(encuestaRef);

                if (encuestaSnap.exists()) {
                    this.encuesta = encuestaSnap.data();
                }
            } catch (error) {
                console.error("Error obteniendo la encuesta:", error);
            }
        },
        irAlChatPrivado() {
            if (this.jugador.uid && this.jugador.nombre) {
                this.$router.push({
                    name: "ChatPrivado",
                    params: { destinatarioId: this.jugador.uid, destinatarioNombre: this.jugador.nombre }
                });
                this.$emit("cerrar");
            }
        }
    },
    watch: {
        jugador: {
            immediate: true,
            handler(newVal) {
                if (newVal && newVal.uid) {
                    this.obtenerDatosEncuesta();
                }
            }
        }
    }
};
</script>
