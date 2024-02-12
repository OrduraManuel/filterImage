<template>
    <div>
        <h2>qyesti p fukeKust</h2>
      <ul v-if="files">
        <li v-for="file in files" :key="file.name">
          {{ file.name }} - {{ file.size }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref , computed} from 'vue';
  
  const files = ref([]);

const handleFolderChange = async (event) => {
  // Emula una richiesta al server per ottenere la lista dei file nella cartella selezionata
  const response = await fetch('/api/getFiles');
  
  const data = await response.json();
  files.value = data.files;
};

// Utilizziamo una computed per reagire ai cambiamenti in files
const filesComputed = computed(() => files.value);

  </script>