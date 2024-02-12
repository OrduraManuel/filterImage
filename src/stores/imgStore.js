import { defineStore } from 'pinia';
//import axios from 'axios';
import { ref, watch } from 'vue';
import { useRouter } from "vue-router";
import ItemService from '@/services/imageService.js'


export const useImgStore = defineStore('ImgStore', () => {

    const Images = ref([]);
    const queryImages = ref([])
    const ImagesLeft = ref(0)
    const Hex = ref('');
    const Perc = ref();
    const loader = ref(0);
    const ImagesCheck = ref(0)
    const counterId = ref(0)

    const isColor = (base64String, colorRGB, soglia, percentuale) => {
      //ImagesLeft.value = Images.value.length
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const data = imageData.data;
          const pixelCount = img.width * img.height;
          let colorCount = 0;

          for (let i = 0; i < data.length; i += 4) {
            const redDiff = Math.abs(data[i] - colorRGB[0]);
            const greenDiff = Math.abs(data[i + 1] - colorRGB[1]);
            const blueDiff = Math.abs(data[i + 2] - colorRGB[2]);
            if ((redDiff <= soglia && redDiff >= -soglia) 
            && (greenDiff <= soglia && greenDiff >= -soglia) 
            && (blueDiff <= soglia && blueDiff >= -soglia)) {
              colorCount++;
            }
          }
          const percentage = (colorCount / pixelCount) * 100;
          if (percentage >= percentuale) {
            resolve(true); // La percentuale di pixel con il colore specificato supera la soglia
          } else {
            resolve(false); // La percentuale di pixel con il colore specificato non raggiunge la soglia
          }
        };
        img.onerror = (error) => {
          reject(error); // gestisci eventuali errori durante il caricamento dell'immagine
        };
        img.src = base64String;
      });
    };
    const filterImgByColor = async (images, colorRGB, soglia, percentuale) => {
      ImagesLeft.value = Images.value.length
      ImagesCheck.value = 0
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      for (let image of images) {
          function bytesToMegabytes(bytes) {
            return bytes / (1024 * 1024);
          }
          console.log('name: ', image.name, 'size: ',bytesToMegabytes(image.size),'MB')
          ImagesCheck.value++
          loader.value =  (ImagesCheck.value / Images.value.length ) * 100
          console.log('loader.value',loader.value)
          const isColorFound = await isColor(image.file, colorRGB, soglia, percentuale)
          if(isColorFound){
            queryImages.value.push(image)
          }
          if(loader.value === 100){
            loader.value = 0
          }
      }
    }
    const createThumbnail = (imageFile, maxWidth, maxHeight, format = 'image/jpeg') => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const width = Math.min(maxWidth, img.width);
          const height = Math.min(maxHeight, img.height);
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          // Ottieni l'immagine base64 dal canvas
          const thumbnailData = canvas.toDataURL(format);
          resolve(thumbnailData); // Restituisci l'immagine base64 della versione ridimensionata
        };
        img.onerror = reject;
        img.src = imageFile;
      });
    };

    const pushImg = async (img) =>{
      if(img.type == 'image/jpeg'){
        img.thumbnail = await createThumbnail(img.file, 200, 200, 'image/jpeg');
      }if(img.type == 'image/png'){
        img.thumbnail = await createThumbnail(img.file, 200, 200, 'image/png');
      }
      Images.value.push(img)
    }
    const pushJson = () =>{
      ItemService.pushImage(queryImages.value)
    }

  return {
    isColor,
    filterImgByColor,
    createThumbnail,
    pushImg,
    pushJson,
    ImagesCheck,
    loader,
    Images,
    queryImages,
    ImagesLeft,
    Hex,
    Perc,
    counterId
  }
});