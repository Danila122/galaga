import Invader from './Invader.js'

//объект захватчиков
const invaders = {

  greenInvader: class GreenInvader extends Invader {
    constructor(instruction) {
      super({ 
        src:'img/invaders/green/spriteGreen.png',
        formationElement: instruction.formationElement,
        velocity: instruction.velocity
      }) 
      this.pointsinvaderInFlight = 400; //очки за уничтодение захватчика в полете
      this.pointsinvaderInLine = 150; //очки за уничтодение захватчика в строю
      this.healthPoints = 2; //необходимое количество попаданий для уничтожения корабля   
    }
  },

  redInvader: class RedInvader extends Invader {
    constructor(instruction) { 
      super({
        src:'img/invaders/red/spriteRed.png',
        formationElement: instruction.formationElement,
        velocity: instruction.velocity
      }) 
      this.pointsinvaderInFlight = 160; //очки за уничтодение захватчика в полете
      this.pointsinvaderInLine = 80; //очки за уничтодение захватчика в строю
      this.width = 40;
      this.height = 25;
    }


  },

  blueInvader: class BlueInvader extends Invader {
    constructor(instruction){ 
      super({
        src:'img/invaders/blue/spriteBlue.png', 
        formationElement: instruction.formationElement,
        velocity: instruction.velocity
      }) 
      this.pointsinvaderInFlight = 100; //очки за уничтодение захватчика в полете
      this.pointsinvaderInLine = 50; //очки за уничтодение захватчика в строю
      this.width = 40;
      this.height = 25;
    }
  },
}

export const GreenInvader = invaders.greenInvader;
export const RedInvader = invaders.redInvader;
export const BlueInvader = invaders.blueInvader