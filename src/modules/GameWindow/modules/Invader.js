import Ship from './Ship.js'
import settings from '../Settings.js'


//Объект захватчика
class Invader extends Ship{
  constructor({src,formationElement,velocity}){
    super({src})
    this.then = Date.now(); //время с начала запуска анимации (движения корабля)
    this.velocity = velocity; //скорость передвижения корабля
    this.formationElement = formationElement; //элемент построения корабля в строй в верхней части экрана
    this.type = 'invader';
    this.angle = 0; //угол поворота
    this.frames = 0;
    this.currentFrame = 0; //текущий кадр анимации
    this.shipIsFlying = false; //параметр устанвалиает, корабль в полете или в строю
    this.requestAnimationId;    
    this.bangSoundEffects = new Audio('audio/bangInvader.mp3'); //звуковой эффект взрыва
    //позиция корабля в предыдущем кадре(необходимо для измерения угла поворота корабля)
    this.previousPosition = {
      x: 0,
      y: 0
    }
    this.bangImage = new Image();
    this.bangImage.src = 'img/invaders/bangInvader/spriteBang.png'; //спрайт взрыва
  }

  //Метод переопределяет родительский метод draw()
  draw() {

    settings.bufferCtx.save();

    if (this.type === 'invader') {
      this.rotateShip(this.angle); //разворот корпуса корабля в зависимости от угла поворота
    }

    super.draw();

    settings.bufferCtx.restore();
  }

  //Метод возвращает угол поворота корабля. Принимает 4 аргумента: точку x0,y0 текущей позиции и точку x,y позиции в предыдущем кадре
  getVectorAngle(x0, x, y0, y) {
    let a;
    let b;
    if (y0 === y) { //проверка, летит ли корабль горизонтально
      if (x > x0) this.angle;
      else if (x < x0) this.angle = 180;
      else if (x === x0) this.angle;
    } else if (x0 === x) { // проверка, летит ли корабль вертикально
      if (y > y0) this.angle = 90;
      else if (y0 > y) this.angle = -90;
      else this.angle = 0;
    }else { //корабль летит под углом
      if (y0 > y && x > x0) {
        a = x - x0;
        b = y - y0;
        this.angle = this.getAngles(a, b)[1];

      }else if (x > x0 && y > y0) {
        a = y - y0;
        b = x - x0;
        this.angle = this.getAngles(a, b)[0];

      } else if (x0 > x && y > y0) {
        a = x - x0;
        b = y - y0;
        this.angle = 90 + this.getAngles(a, b)[0];

      } else if (y0 > y && x0 > x) {
        a = x - x0;
        b = y - y0;
        this.angle = 180 - this.getAngles(a, b)[1];

      };
    }
    return this.angle;
  }

  // Метод поворачивает корабль (canvas элемент)
  rotateShip(degrees) {
    settings.bufferCtx.translate(
      this.position.x,
      this.position.y
    );

    settings.bufferCtx.rotate(degrees * Math.PI / 180);

    settings.bufferCtx.translate(
      -this.position.x,
      -this.position.y
    );
  }

  //Метод находит угол по двум сторонам и прямому углу между ними
  getAngles(a, b) {
    let result = [];

    const c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

    const getAngleRadians = Math.acos((Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2)) / (2 * b * c)) ;
    const getAngleDegrees = Math.round(getAngleRadians * 180 / 3.1416);

    result.push(getAngleDegrees);
    result.push(90 - getAngleDegrees);

    return result;
  }

  //Метод перемещает корабль по кривой Безье
  move(t, element) {
    let x = Math.pow((1 - t), 3) * element[0] + 3 * Math.pow((1 - t), 2) * t * element[2] + 3 * (1 - t) * Math.pow(t, 2) * element[4] + Math.pow(t, 3) * element[6];
    let y = Math.pow((1 - t), 3) * element[1] + 3 * Math.pow((1 - t), 2) * t * element[3] + 3 * (1 - t) * Math.pow(t, 2) * element[5] + Math.pow(t, 3) * element[7];

    this.position.x = x;
    this.position.y = y;

    if (this.frames % 2 === 0) {
      this.previousPosition.x = x;
      this.previousPosition.y = y;
    }
  }

  //Метод расчёта времени, которая вычисляет прогресс анимации 
  timing(timeFraction) {
    return Math.pow(timeFraction, 2); //параболическая кривая
  }

  //Метод отвечает за построене корабля в строй
  formation() {

    this.shipIsFlying = true; //переводим захватчика в режим полета
    const duration = 4000 - this.velocity * 200; //продолжительность анимации. При увеличении скорости движения, уменьшается время построения кораблей

    const formation =()=> {
      this.getVectorAngle(this.position.y, this.previousPosition.y, this.previousPosition.x, this.position.x,); // находим угол вектора

      let countOfFrames = 60 * duration / 1000; //общее количество кадров
      let frameDuration = 1 / countOfFrames; //длительность одного кадра
      this.currentFrame += frameDuration;

      let progress = this.timing(this.currentFrame).toFixed(4); // вычисление текущего состояния анимации

      this.move(progress, this.formationElement); //отрисовка анимации

      if (progress >= 1) { //остановка анимации
        this.angle = 0;
        this.shipIsFlying = false;
        this.currentFrame = 0;
        return
      }

      this.frames++
    }

    // Функция контролирует fps для requestAnimationFrame, т.е. указываем частоту кадров не более settings.fps
    // Такая функция необходима для корректной работы приложения на мониторах с частотой обновления экрана > 60гц
    const anim = ()=>{
      let delta;
      let interval = 1000/settings.fps;
      let now = Date.now();

      delta = now - this.then;
  
      if (delta > interval) {
        this.then = now - (delta % interval);
        formation();
      }

      if(!this.shipIsFlying){ //если корабль закончил построние, прекращаем анимацию
        return
      }
      this.requestAnimationId = requestAnimationFrame(anim);

    }
    anim()
  }

  //Метод отвечает за атаку захватчиков
  attack(){

    const attack = ()=>{
      
      this.shipIsFlying = true; //переводим захватчика в режим полета
      this.position.y += this.velocity;
    }

    // Функция контролирует fps для requestAnimationFrame, т.е. указываем частоту кадров не более settings.fps
    // Такая функция необходима для корректной работы приложения на мониторах с частотой обновления экрана > 60гц
    const anim = ()=>{
      let delta;
      let interval = 1000/settings.fps;
      let now = Date.now();


      delta = now - this.then;
  
      if (delta > interval) {
  
        this.then = now - (delta % interval);
        attack()
      }
      this.requestAnimationId = requestAnimationFrame(anim);

    }

    anim()
  }

  //Метод рисует анимацию взрыва на том месте, где взорвался корабль
  drawBang() {

    return new Promise( resolve => {
      this.appearance=null;
      
      cancelAnimationFrame(this.spriteIntervalId); //удаляем интервал анимации внешнего вида
      this.width = 70;
      this.height = 70;
  
      this.appearance = this.sprite({ inputImage: this.bangImage, type: 'bang' });
      
      setTimeout( ()=> {
        cancelAnimationFrame(this.spriteIntervalId);
        resolve();
      }, 500);
    })
  }
}

export default Invader