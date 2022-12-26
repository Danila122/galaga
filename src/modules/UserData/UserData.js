
//Объект с информацией о пользователе
class UserData{
  constructor(){
    //инициализируем firebase
    this.firebaseApp = firebase.initializeApp({
      apiKey: "AIzaSyCWeedQW9fWPeaUpBTMzpIW9B_xrgk2Y20",
      authDomain: "game-5c04e.firebaseapp.com",
      databaseURL: "https://game-5c04e-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "game-5c04e",
      storageBucket: "game-5c04e.appspot.com",
      messagingSenderId: "856358946741",
      appId: "1:856358946741:web:cde27ba3e684f88becbbfc",
      measurementId: "G-0MYR3LM0Y1"
    })
    this.myAppDB = this.firebaseApp.database();
    this.database = null; //данные о всех пользователях приложения
    this.errorMessage=null; //информирующее сообщение, если пользователь ввел не корректную информацию в поле
    this.minLengthUserName = 2;
    this.maxLengthUserName = 8;
    this.form = null;
    this.input= null;
    this.buttpn= null;
    this.value= null;
  }

  //Метод удаляет Placeholde при клике на поле 
  removePlaceholder(){
    const placeholderInput = this.input.placeholder;
  
    this.input.addEventListener('focus',()=>{
      if(this.errorMessage){
        this.errorMessage.innerHTML='';

      }
      this.input.placeholder = '';        
    })
    
    this.input.addEventListener('blur',()=>{
      this.input.placeholder = placeholderInput;
    }) 
  }

  //Метод обновляет перезаписывает в БД данные о количестве очков поьзователя
  updateUserDataInDataBase(userScore){ 
    let userName = JSON.parse(localStorage.getItem('galagaGameUserInfo')).name; //получаем имя пользователя
    
    //если количество набранных очков больше, чем в БД, данные перезаписываются 
    if(userScore > this.database['user_'+userName].score){
      firebase.database().ref('users/' + 'user_'+ userName).set({
        name: userName,
        score: userScore
      });
  
      this.printBestPlayerResult(); //отображаем на странице лучший результат
    }
  }

  //Метод сохраняет данные в БД
  saveDataInDataBase(nameUser,score=0){
    const userInfo = {
      name: nameUser,
      score: score
    } 
    
    firebase.database().ref('users/' + 'user_'+ nameUser.replace(/\s/g, "").toLowerCase()).set(userInfo);
  }

  //Метод сохраняет данные в localStorage
  saveDataInStorage(storageName){
    const userInfo = {
      name: storageName,
    }

    localStorage.setItem('galagaGameUserInfo', JSON.stringify(userInfo));
  }

  //Метод проверяет введеные данные в input
  getInfoFromInput(){
    //находим DOM элементы
    this.input = document.querySelector('.userInfo__name');
    this.button = document.querySelector('.userInfo__submit-button');
    this.form = document.getElementById('form');
    this.removePlaceholder();

    //добавляем на страницу предупреждающее сообщение
    this.errorMessage = document.createElement('span');
    this.errorMessage.classList.add('error-message');
    this.input.after(this.errorMessage);
    

    this.form.addEventListener('submit', (event)=>{
      event.preventDefault();
      const userName = this.input.value.toLowerCase(); //получаем введенное значение
      const userKey = 'user_'+userName.replace(/\s/g, "").toLowerCase(); //ключ, по которому можной найти пользователя в БД
      let message
         

      if(userName.length === 0 || userName.trim()===''){ //пользователь ничего не ввел
        message='enter your name';
      }else if(userName.length<this.minLengthUserName){ //проверка на длину имени 
        message=`min number of characters ${this.minLengthUserName}`;
      }else if(userName.length>this.maxLengthUserName){
        message=`max number of characters ${this.maxLengthUserName}`;
      }else if(/[а-я]/i.test(userName)){ //проверка на кириллицу
        message='enter latin characters';
      }else if(this.database && this.database[userKey] && userName === this.database[userKey].name){ //проверка, существует ли такой уже такой пользователь в БД
        message='this name already exists';
      }else{
        this.saveDataInStorage(userName);
        this.saveDataInDataBase(userName);
        location.hash = '#main'; //после сохранения имени открываем главную страницу
        return
      }

      this.errorMessage.innerHTML = message; //отображение информирующего сообщения под input
    })
  }


  //Метод отображает на странице лучший результат пользователя
  printBestPlayerResult(){
    let userName = JSON.parse(localStorage.getItem('galagaGameUserInfo')).name;
    const userData = this.database['user_'+userName]; //находим объект с данными пользователя

    if(userData.score===0){
      document.querySelector('.high-score').innerHTML = '00';
    }else{
      document.querySelector('.high-score').innerHTML = userData.score;
    }  
  }


  //Метод получает информацию о всех пользователях в БД и сохраняет в this.database
  init(){
    return new Promise( resolve => {
      this.myAppDB.ref('users/').on(
        'value',
        (snapshot)=>{
          this.database = snapshot.val();
          resolve();
        },
        (error)=> console.log(error), 
      ) 
    })
  }
}

export default UserData