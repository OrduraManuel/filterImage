<script setup>
import { ref, onMounted } from 'vue';

import ItemService from '@/services/imageService.js'


const items = ref()

onMounted(async () => {
  try {
    const response = await ItemService.getAllImages()
    items.value = response.data
  }catch (error) {
    console.error('Error fetching images:', error);
  }
  
})
</script>

<template>
  <div class="about" v-if="items">
    <h1>This is an about page</h1>
    <ul class="ul" >
      <li class="li" v-for="item in items" :key="item.id">
        <div class="imagess">
          <img width="150px" :src="item.file" alt="File">
        </div>
        <div class="descrr">
          <p>Nome: {{ item.name }}</p>
          <p>Tipo: {{ item.type }}</p>
          <p>Dimensione: {{ item.size }} bytes</p>
          <p>Ultima modifica: {{ new Date(item.lastModified).toLocaleString() }}</p>
          <!-- Visualizza l'immagine utilizzando i dati codificati in base64 -->
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
}
.ul{
  background: grey;
  margin-top: 50px;
  padding: 30px;
  .li{
    background: white;
    color: black;
    padding: 10px;
    display: flex;
    .descrr,.imagess{
      padding: 10px;
    }
  }
}
</style>
