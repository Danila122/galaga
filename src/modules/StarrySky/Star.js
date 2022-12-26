import settings from './settings.js'


//Объект звезды
class Star{
  constructor(speed,opasity){ 
    this.frames=0;
    this.colors = ['blue','yellow','orange','purple']; //возможные цвета звезд
    this.position = { //устанавливает позицию звезды
      x: Math.round(Math.random() * settings.canvas.width),
      y: Math.round(Math.random() * settings.canvas.height)
    }
    this.size= this.getRandom(.7,2); // размер звезд от 0.7-2 радиусов    
    this.speed = this.getRandom(speed-speed*0.5, speed); //скорость перемещения звезды
    this.timeOpacity = this.getRandom(30,50); //частота мигание звезды 
    this.color = this.colors[Math.round(Math.random() * this.colors.length)]; //выбирается случайный цвет звезды тз массива
    this.opasity = opasity ? 0.7 : 0; //проверка, должна ли звезда при создании быть видна
    this.flashingStar();
  }

  //Метод запускает мигание звезды
  flashingStar(){

    if(this.frames%this.timeOpacity===0){
      this.opasity = this.opasity ? 0 : 0.7;
    }

    this.frames++
    
    requestAnimationFrame(()=>this.flashingStar());
  }

  //Метод возвращает случайное число в диапазоне от min до max
  getRandom(min, max){ 
    const number = Math.random() * (max - min) + min;
    return Math.floor(Number(number.toFixed(1)));
  }

  //Метод рисует звезду
  draw(){
    settings.bufferCtx.globalAlpha = this.opasity; //устанавливаем прозрачность звезды
    settings.bufferCtx.beginPath();
    settings.bufferCtx.arc(this.position.x,this.position.y,this.size,0, 2*Math.PI, false)
    settings.bufferCtx.fillStyle = this.color;
    settings.bufferCtx.fill();
  }

  //Метод обновляет позицию звезды
  update(){
    this.draw();
    this.position.y += this.speed;
    //если долетела до низа, уводим ее снова вверх за рамки канваса на случаную позицию по x
    if(this.position.y > settings.canvas.height){ 
      this.position.y = 0;
      this.position.x = this.getRandom(1, 700);
    }
  }
}

export default Star