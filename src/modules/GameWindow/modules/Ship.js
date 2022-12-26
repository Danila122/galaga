import settings from '../Settings.js'


//Объект корабля
class Ship {
  constructor({src}) {
    //размеры корабля по умолчанию
    this.width = 40;
    this.height = 40;

    //начальная позиция корабля
    this.position = {
      x: -40,
      y: -40,
    }
    this.healthPoints = 1; //количество жизней коробля по умолчанию
    this.spriteIntervalId; //ID анимации
    this.frames = 0; //количество кадров (вызова requestAnimationFrame)    
    this.image = new Image();
    this.image.onload = () => { 
      this.type === 'player' ? this.appearance = this.image //внешний вид корабля игкрока не анимируется
         : this.appearance = this.sprite({ inputImage: this.image, type: 'appearance' }); 
    }
    this.image.src = src; // загрузка изображения (спрайта с фреймами анимации)
  }

  //Метод перерисовывает корабль в зависимости от координат
  draw() {
    if (this.appearance) {
      settings.bufferCtx.drawImage(
        this.appearance,
        this.position.x - this.width / 2,
        this.position.y - this.height / 2,
        this.width,
        this.height
      )
    }
  }

  //Метод анимирует спрайт
  sprite({inputImage, type='appearance', rateFrame}){ 
    this.frame = 0;

    const outputImage = document.createElement('canvas'); //создаем canvas, в который поместим изображение
    const outputImageCtx = outputImage.getContext('2d');
    const widthImage = inputImage.width;
    const heightImage = inputImage.height;

    outputImage.width = widthImage;
    outputImage.height = heightImage;

    let frameIndex = 0; //индекс активного фрейма
    let frameRate=500; //частота оновления фреймабъ,миллисекунд
    let numberOfFrames = 2;  //количество фреймов в спрайте

    if(type==='bang' ){
      //если спрайт со взрывом, то устанавливаем частоту оновления фрейма
      frameRate= rateFrame ? rateFrame : 60;
      numberOfFrames = 4;
    }

    //размеры одного фрейма
    const widthFrame = widthImage / numberOfFrames; 
    const heightFrame = heightImage;

    //функция выризает изображение из спарйта и отрисовывает нужный фрейм
    const render = ()=> {
      outputImageCtx.drawImage(
        inputImage, // исходное изображение-спрайт
        frameIndex * widthFrame, //x-координата верхнего левого угла нужного фрейма на спрайте
        0, //y-координата верхнего левого угла нужного фрейма на спрайте
        widthFrame, //ширина фрейма
        heightFrame, //высота фрейма
        outputImage.width/2-widthImage/2, //x-координата точки на холсте, где начнется отрисовка фрейма (его верхний левый угол)
        outputImage.height/2-heightImage/2, // y-координата точки на холсте, где начнется отрисовка фрейма
        widthImage, //ширина отрисованного на холсте фрейма
        heightImage //высота отрисованного на холсте фрейма
      )
    }

    const animationSprite = ()=>{

      if(this.frame%frameRate===0){ 
        outputImageCtx.clearRect(0, 0, outputImage.width, outputImage.height);//очистка холста
        
        render();

         //проверка, если индекс фрейма равен количеству фреймов в спрайте, то начать анимацию сначала
        if(frameIndex>=numberOfFrames-1){
          type==='bang' ? frameIndex=4:frameIndex=0; //если спрайт со взрывом корабля, то закончить анимацию
        }else{
          frameIndex++
        }  
      }

      this.frame+=10;
      this.spriteIntervalId = requestAnimationFrame(()=>animationSprite());
    }

    animationSprite();
    
    return outputImage
  }
}

export default Ship


