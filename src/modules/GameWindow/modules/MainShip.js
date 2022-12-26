import Ship from './Ship.js'
import KeyControls from './KeyControls.js'
import Projectile from './Projectile.js'
import settings from '../Settings.js'


//Объект корабля игрока
class MainShip extends Ship {
  constructor() {
    super({ src: 'img/mainShip.png' });
    this.projectileSpeed = 12; //скорость движения снаряда
    this.shotSoundEffects = new Audio('audio/shot.mp3'); 
    this.bangSoundEffects = new Audio('audio/bangMainShip2.mp3');
    this.projectiles = []; //хранилище снарядов
    this.type = 'player';
    this.shipExplosion = false; //параметр блокирует управление кораблем во время взрыва
    this.speed = {
      x: 0,
      y: 0,
    }
    //начальная позиция
    this.position = {
      x: 350,
      y: 800- this.height / 2
    }
    this.bangImage = new Image();
    this.bangImage.src = 'img/invaders/bangPlayer/spriteBang.png'; //загрузка спрайта взрыва
    this.keyBoard = new KeyControls(['ArrowLeft', 'ArrowUp', 'ArrowRight','ArrowDown','KeyA','KeyD']); //клавиши управления кораблем
    this.keys = this.keyBoard.keys;
  }

  //Метод создает выстрел (добавление снаряда в массив projectiles)
  shot() {
    settings.playSound(this.shotSoundEffects); //проигрываем звуковой эффект выстрела

    //в массив со снарядами добавляем снаряд
    this.projectiles.push(new Projectile({
      position: {
        x: this.position.x,  //позиция, с которой снаряд должен начать движение
        y: this.position.y - this.height / 2,
      },
      speed: {
        x: 0,
        y: -this.projectileSpeed //скорость движения снаряда
      },
      type: this.type
    }))
  }

  //Метод приводит в движение снаряды в массиве projectiles
  activeProjectile() {
    this.projectiles.forEach((projectile, index) => {
      if (projectile.position.y + projectile.height < 0 || projectile.position.y + projectile.height > settings.bufferCanvas.height) {  //если снаряд за пределами игрового окна - удаляется из массива
        setTimeout(() => {
          this.projectiles.splice(index, 1);
        }, 0)
      } else {
        projectile.update(); //обновление позиции снаряда
      }
    })
  }

  //Метод срабатывает, когда по кораблю попал снаряд
  hit() {
    return new Promise(resolve => {
      this.appearance=null; //удаляем изображение внешнего вида корабля
      settings.playSound(this.bangSoundEffects); //активируем звуковой эффект взрыва
     
      this.shipExplosion=true; 

      //размеры взрыва
      this.width = 70;
      this.height = 70;
      this.position.y = 770;
  
      // анимация взрыва
      this.appearance = this.sprite({inputImage: this.bangImage, type: 'bang', rateFrame: 200 });
 
      setTimeout(()=>{
        cancelAnimationFrame(this.spriteIntervalId); //удаляем анимацию взрыва
        resolve();
      },2000);
    })
  }

  //Метод обновляет позиция корабля
  update() {
    this.draw();
    if (this.shipExplosion) return //блокирем управление кораблем 
    
    //Управление кораблем + ограничения по вылету корабля за пределы окна
    if (this.keys.KeyD || this.keys.ArrowRight && this.position.x + this.width / 1.5 <= settings.bufferCanvas.width) {
      this.speed.x = 7;
    } else if (this.keys.KeyA || this.keys.ArrowLeft && this.position.x - this.width / 1.5 >= 0) {
      this.speed.x = -7;
    } else {
      this.speed.x = 0;
      this.speed.y = 0;
    }

    this.activeProjectile();
    
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;
  }
}

export default MainShip