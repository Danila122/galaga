const UserScore = {
  render: () => {
    return `
      <section class="userInfo page">
        <div class="userInfo__body page-body">
          <img src="img/logo.png" alt="">
          <form action='#' id='form'>
            <input class="userInfo__name" type="text" placeholder="your name...">
            <button class="userInfo__submit-button" type="submit">Submit</button>
          </form>
        </div>
      </section> 
    `;
  }
}; 
{/* <lable>Enter your name</lable> */}

export default UserScore;