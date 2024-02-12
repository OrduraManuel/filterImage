<script setup>
import { ref, onMounted, computed } from 'vue';

import { useImgStore } from '@/stores';
import { storeToRefs } from 'pinia';

const ImgStore = useImgStore()
const { Images, ImagesLeft, queryImages, loader } = storeToRefs(ImgStore)

const getLoader = computed(() => gettingLoad(loader.value +'%'));

const width = ref('0%')

function gettingLoad(number){
    if(number != 100){
        width.value = number
        return width.value
    }else{
        width.value = 0 
        return width.value
    }

}

</script>
<template>
    <div class="container-fluid" v-if="loader != 0">
        <div class="loader">
            <span>{{ Math.floor(loader) + '%' }}</span>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.container-fluid{
    position: fixed;
    top:0;
    left:0;
    width: 100%;
    height: 20vh;
    background: rgba(255,255,255,.5);
    backdrop-filter: blur(5px);
    transition: all .5s ease-in-out;
    z-index: 10;
    padding: 2vh;
    .loader{
        background: purple;
        width: v-bind(getLoader);
        height: 100%;
        transition: all .5s ease-in-out;
        border-radius: 35px;
        display:flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 30px;
        font-weight: 600;
        padding: 2%;
        color: white;
    }
}
</style>