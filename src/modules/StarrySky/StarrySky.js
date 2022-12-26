import Star from './Star.js'
import settings from './settings.js'


//Объект звездного небо
class StarrySky{
  constructor({speed}){        
    // собираем данные об канвасе         
    settings.canvas = document.querySelector('#starrySky');
    settings.ctx = settings.canvas.getContext("2d");
    // создаем буферизирующий канвас
    settings.bufferCanvas = document.createElement("canvas");
    settings.bufferCtx = settings.bufferCanvas.getContext("2d");
    settings.bufferCtx.canvas.width = settings.ctx.canvas.width;
    settings.bufferCtx.canvas.height = settings.ctx.canvas.height;
    this.starsArray = []; //массив со звездами
    this.speedStar = speed;
    this.createStars();
  }

  //Заполнения массива starsArray звездами 
  createStars(){
    for (let i = 0; i < settings.starsMax; i++) {
      if(i%2===0){ //каждая вторая звезда при создании не должна быть видна
        this.starsArray.push(new Star(this.speedStar,true));
      }else{
        this.starsArray.push(new Star(this.speedStar,false)); 
      }
    }
  }

  //Очистка canvas
  blank() {
    settings.bufferCtx.globalAlpha = 1;
    settings.bufferCtx.fillStyle = settings.skyColor;
    settings.bufferCtx.fillRect(0, 0, settings.bufferCanvas.width, settings.bufferCanvas.height);
  }

  //Метод рисует звезды
  draw(){
    this.blank();
    this.starsArray.forEach(star=>star.draw()); //отрисока каждой звезды в массиве

    //как только все звезды отрисовались в буфере, мы копируем все это в наш основной канвас
    settings.ctx.drawImage(settings.bufferCanvas, 0, 0, settings.canvas.width, settings.canvas.height);
    this.drawId = requestAnimationFrame(()=>this.draw());
  }

  //Метод обновляет позицию звездам
  update(){
    this.blank();
    this.starsArray.forEach(star => star.update()); //обновляем позицию каждой звезде в массиве
      
    //как только все звезды отрисовались в буфере, мы копируем все это в наш основной канвас
    settings.ctx.drawImage(settings.bufferCanvas, 0, 0, settings.canvas.width, settings.canvas.height);
    this.updateId = requestAnimationFrame(()=>this.update());

  }

  //Метод приводит в движение звезды
  start(){
    cancelAnimationFrame(this.drawId); //останавливаем отрисовку звезд
    this.update();
  }

  //Метод отображает звезды
  stop(){
    this.starsArray.forEach(star=>star.frames = 0);
    cancelAnimationFrame(this.updateId); //останавливаем перемещение звезд
    this.draw();
  }
}



export default StarrySky






