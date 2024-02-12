<script setup>
import { ref, computed } from 'vue';
import { useImgStore } from '@/stores';

import footerino from '@/components/footer.vue';


import loadBar from '@/components/loadBar.vue';
import listFiles from '@/components/listFiles.vue';

import inputForm from '@/components/inputForm.vue';

</script>

<template>
  <main>
    <div class="homepage">
      <loadBar />
      <inputForm />
      <listFiles />
      <footerino />
    </div>
  </main>
</template>
