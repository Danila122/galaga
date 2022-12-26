const Control = {
  render: () => {
    return `
    <section class="control page">
      <div class="control__body page-body">
        <div class="control__title title">control</div>
        <div class="control__text">
          <div class="control__item">
            <p>move left</p>
            <div class="control__buttons">
              <span class="control__button"><i>A</i></span>
              or
              <span class="control__button arrow"><i>&#129044;</i></span>
            </div>
          </div>
          <div class="control__item">
            <p>move right</p>
            <div class="control__buttons">
              <span class="control__button"><i>D</i></span>
              or
              <span class="control__button arrow"><i>&#129046;</i></span>
            </div>
          </div>
          <div class="control__item">
            <p>shot</p>
            <div class="control__buttons">
              <span class="control__button space"><i>space</i></span>
              or
              <span class="control__button"><i>F</i></span>
            </div>
          </div>
        </div>
      </div>
    </section> 
    `;
  }
};

export default Control;