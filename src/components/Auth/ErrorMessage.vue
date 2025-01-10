<template>
    <div v-if="message" class="error-message p-4 bg-red-100 border border-red-400 text-red-700 rounded relative" role="alert">
      <span class="block sm:inline">{{ message }}</span>
      <button class="absolute top-0 right-0 p-1 text-red-700 hover:text-red-900" @click="clear">✖</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ErrorMessage',
    props: {
      message: {
        type: String,
        default: ''
      }
    },
    methods: {
      clear() {
        this.$emit('clear'); 
      }
    }
  };
  </script>
  
  <style scoped>
  .error-message {
    margin-bottom: 1rem; 
  }
  </style>
  