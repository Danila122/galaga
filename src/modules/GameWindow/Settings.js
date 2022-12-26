//Объект с настройками игрового поля
const settings = {
  canvas: null,
  ctx: null,
  bufferCanvas: null,
  bufferCtx: null,
  fps: 70,

  //Метод произрывает аудио запись
  playSound(audio){
    audio.currentTime = 0;
    audio.volume=0.1;
    audio.play();
  },

  //Метод возвращает случайное число в диапазоне от min до max
  getRandom(min, max){
    const number = Math.random() * (max - min) + min;  //max включается
    return Math.floor(Number(number));
  },
}

export default settings