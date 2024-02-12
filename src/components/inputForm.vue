<script setup>
import { ref, computed } from 'vue';

//import fileList from '@/components/fileList.vue';

import ItemService from '@/services/imageService.js'

import { useImgStore } from '@/stores';
import { storeToRefs } from 'pinia';

const ImgStore = useImgStore()
const { Images, ImagesLeft, queryImages, counterId } = storeToRefs(ImgStore)

//57,47,109 viola
// 139,21,40 bordeaux
const hexInput = ref('#554433');
const sogliaInput = ref(255)
const percInput = ref(10);
const fileUploaded = ref(false)

const handleSubmit = () => {
  // Gestisci il submit del form qui
  console.log('Stringa di testo:', hexInput.value);
  console.log('hexToRgb(hexInput.value):', hexToRgb(hexInput.value));
  console.log('Numero:', percInput.value);
  console.log('Stringa di testo:', sogliaInput.value);
  counterId.value = 0
  if(Images.value){
    queryImages.value.splice(0, queryImages.value.length)
    ImgStore.filterImgByColor(Images.value, hexToRgb(hexInput.value), sogliaInput.value, percInput.value); // Passa la stringa invece dell'array
  } else {
    console.error('Nessun file in store.');
  }
};
function goUpload(){
    myUpload.value.click()
}

const files = ref([]);
const myUpload = ref();
let filesWaste = 0
const textColor = computed(() => getTextColor(hexInput.value));

function getTextColor(color) {
  // Converti il colore in RGB
  const rgb = parseInt(color.substring(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  // Calcola la luminosità del colore
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  // Restituisci il colore del testo appropriato in base alla luminosità
  return luminance > 0.5 ? '#000' : '#fff';
}

const handleFolderChange = async (event) => {
    fileUploaded.value = event.target.files
    filesWaste = 0
    for (let i = 0; i < fileUploaded.value.length; i++) {
        const file = fileUploaded.value[i];
        if(file.type == 'image/jpeg' || file.type == 'image/png'){
            counterId.value++
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                let nuovaImg = {
                'id': counterId.value,
                'name': file.name,
                'type': file.type,
                'size': file.size,
                'lastModified': file.lastModified,
                'file': reader.result
                }
                ImgStore.pushImg(nuovaImg)
                ImagesLeft.value = Images.value.length
            }
        }else{filesWaste++}
    }
};

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.replace(/(.)/g, '$1$1');
  }
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

</script>
<template>
    <div class="container-fluid">
        <form @submit.prevent="handleSubmit">
            <div class="row justify-content-around">

                <div class="col-10 mx-auto col-md-2 sel">
                    <!--<div class="icon">
                         <img src="@/assets/img/color.png" alt="">
                    </div>-->
                    <div class="title">
                        <span class="title">Seleziona un colore:</span>
                    </div>
                    <div class="input">
                        <input type="color" id="color-picker" v-model="hexInput"/>
                        <span class="rgb">
                            {{ hexInput }}
                        </span>
                    </div>
                </div>
                <div class="col-10 mx-auto col-md-2  sel">
                    <!--<div class="icon">
                         <img src="@/assets/img/soglia.png" alt="">
                    </div>-->
                    <div class="title">
                        <span class="title">Scegli una soglia: (da 0 a 255)</span>
                    </div>
                    <div class="input">
                        <input type="number" class="soglia" id="numberInput" v-model.number="sogliaInput">
                    </div>                
                </div>
                <div class="col-10 mx-auto col-md-2  sel">
                    <!--<div class="icon">
                         <img src="@/assets/img/percentage.png" alt="">
                    </div>-->
                    <div class="title">
                        <span class="title">Presenza minima in %: (da 1 a 100)</span>
                    </div>
                    <div class="input">
                        <input type="number" class="percentage" id="numberInput" v-model.number="percInput">
                    </div>                
                </div>
                <div class="col-10 mx-auto col-md-2  sel">
                    <!--<div class="icon">
                         <img src="@/assets/img/cariola.png" alt="">
                    </div>-->
                    <div class="title">
                        <span class="title">Scegli la tua cartella:</span>
                    </div>
                    <div class="input">
                        <div class="my-auto btn btn-primary" @click="goUpload()">upload</div>
                        <input type="file" ref="myUpload" style="display:none" class="form-control input" id="folderInput" webkitdirectory directory @change="handleFolderChange">
                    </div>                
                </div>




                <div class="col-10 col-md-5 mx-auto checkFiles" v-if="fileUploaded">
                    <div class="data">
                        <!--<div class="icon">
                            <img src="@/assets/img/checkFiles.png" alt="">
                        </div>-->
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Accettati</th>
                                    <th scope="col">Scartati</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{{Images.length}}</td>
                                    <td>{{ filesWaste  }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <button type="submit" class="btn btn-primary" >Invia</button>

                </div>
            </div>
            <div class="col-12 d-flex justify-content-center">
            </div>
        </form>
    </div>


</template>
<style lang="scss" scoped>


    form{
        .sel{
            //height: 40dvh;
            display:flex;
            flex-direction: column;
            justify-content: flex-end;
            background: white;
            padding: 10px;
            border-radius: 10px;
            box-shadow: 0px 0px 21px 5px rgba(0,0,0,0.1);
            .icon{
                position: relative;
                width: 100%;
                height: 40%;
                img{
                    width: 100px;
                }
            }
            .title{
                padding-left: 10px;
                font-style: italic;
                font-weight: 500;
                color: rgb(141, 141, 141); 
            }
            .input{
                width: 100%;
                position: relative;
                border: 2px solid rgb(185, 185, 185);
                background: whitesmoke;
                padding: 10px;
                border-radius: 30px;
                display: flex;
                justify-content: space-around;
                align-content: center;
                height: 150px;
                .rgb{
                    position: absolute;
                    bottom: 10%;
                    left: 0%;
                    transform: translate(50%,50%);
                    right: calc(var(--pCard) + var(--pPicker));
                    background: rgba(255,255,255,0.5);
                    backdrop-filter: blur(5px);
                    padding: 2px;
                    height: 35px;
                    width: 50%;
                    border-radius: 10px;
                    cursor: pointer!important;
                    display:flex;
                    justify-content: center;
                    align-items: center;
                }
                input[type="color"] {
                    -webkit-appearance: none;
                    border: none;
                    width: 100%;
                    height: 100%;
                    border-radius: 20px;
                }
                input[type=number]{
                    font-size: 24px;
                    height: 100%;
                    background: whitesmoke;
                    border: none;
                    &:focus{
                        outline: none;
                    }
                    &::-webkit-inner-spin-button{
                        opacity: 1;
                    }
                }
                .btn-primary{
                    width:66%;
                    height: 50%;
                    display:flex;
                    justify-content: center;
                    align-items: center;
                    background: v-bind(hexInput);
                    color: v-bind(textColor);
                    box-shadow: 0px 6px 23px 1px rgba(0,0,0,0.71);
                    transition: all .2s ease-out;
                    border: none;
                    &:hover{
                        transform: scale(1.2);
                        box-shadow: 0px 0px 37px 14px rgba(0,0,0,0.04);
                        transition: all .4s ease-in;
                    }
                }

            }
        }
        .checkFiles{
            display:flex;
            justify-content: space-between;
            flex-direction: column;
            margin-top: 5%;
            box-shadow: 0px 0px 21px 5px rgba(0,0,0,0.1);
            padding:2%;
            .data{
                display: flex;
                justify-content: space-around;
                background: white;
                
                .icon{
                    position: relative;
                    width: 33%;
                    height: 100%;
                    img{
                        width: 300px;
                        position: absolute;
                        transform: translate(-50%,-50%);
                        top:50%;
                        left:20%;
                    }
                }
            }
        }




    }
</style>