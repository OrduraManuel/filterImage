<script setup>

import { ref, onMounted, computed } from 'vue';

import { useImgStore } from '@/stores';
import { storeToRefs } from 'pinia';

const ImgStore = useImgStore()
const { Images, ImagesLeft, queryImages, loader } = storeToRefs(ImgStore)




</script>
<template>
    <div class="listFiles" v-if="queryImages">
        <h2 >
            Il numero di Immagini caricate sono: 
            <span id="ImagesNumber"></span>
            {{ Images.length }}
        </h2>
        <h2 style="border-top:1px solid black"> 
            Mancano: {{ ImagesLeft }} files al completamento:
        </h2>
        <ul class="ul" >
            <li class="li" style="display:flex" v-for="queryImage in queryImages" :key="queryImage.id">
                <div class="imagess" :id="queryImage.id" >
                    <img :src="queryImage.thumbnail" alt="File">
                    <a class="download" :href="queryImage.file" :download="queryImage.name"> scaricami </a>
                </div>
                <div class="descrr">
                    <p>Nome: {{ queryImage.name }}</p>
                    <p>Tipo: {{ queryImage.type }}</p>
                    <p>Dimensione: {{ queryImage.size }} bytes</p>
                    <p>Ultima modifica: {{ new Date(queryImage.lastModified).toLocaleString() }}</p>
                </div>
            </li>
        </ul>
    </div>
</template>
<style lang="scss" scoped>
.listFiles{
    margin: 5%;
    padding: 2%;
    background: white;
    ul{
        display:flex;
        flex-wrap: wrap;
        li{
            display:flex;
            justify-content: space-around;
            align-items: center;
            margin: 1%;
            padding: 2%;
            background: whitesmoke;
            .descrr{
                height: 100%;
                display: flex;
                justify-content: center;
                flex-direction: column;
                padding: 0 3%;
            }
            .imagess{
                position: relative;
                img{
                    width: 200px;
                }
                .download{
                    position: absolute;
                    bottom: 10%;
                    right: 10%;
                    backdrop-filter: blur(5px);
                    background: rgba(255,255,255,.4);
                    color: black;
                    padding:2%;
                    border-radius: 10px;
                    text-decoration: none;
                    transition: all .4s ease-in-out;
                    &:hover{
                        transform: scale(1.1);
                        background: black;
                    color: white;
                    transition: all .4s ease-in-out;
                    }
                }
            }

        }
    }
}
</style>