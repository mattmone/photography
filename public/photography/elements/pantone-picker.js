import { LitElement, html, css } from 'https://unpkg.com/lit-element@2.2.1/lit-element.js?module=true';
import { pantoneColors } from '../pantone-colors.js';

class PantonePicker extends LitElement {
  static get styles() {
    return css`
      :host {
        position:fixed;
        top:0;
        left:0;
        display:flex;
        align-items:center;
        justify-content:center;
        height:100%;
        width:100%;
        background-color:rgba(0,0,0,0.8);
        transform:scale(0);
        transform-origin:center center;
        transition:transform 0.4s cubic-bezier(0,0.24,0.9,1);
        z-index: 100;
      }
      :host([open]) {
        transform:scale(1);
      }
      #dialog {
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:flex-start;
        height: 90%;
        width:100%;
      }
      main {
        height: 100%;
        width: 90%;
        background-color:#fff;
        overflow:auto;
        display:grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-auto-rows: 7rem;
        grid-gap: 4px;
        border-radius: 4px;
      }
      .color {
        background:none;
        border:none;
        height:100%;
        padding:0;
        margin:0;
        position:relative;
        border-radius: 8px;
        overflow:hidden;
      }
      .color span {
        position:absolute;
        bottom:0;
        left:0;
        right:0;
        text-align:center;
        background-color:rgba(0,0,0,0.4);
        padding: 4px;
        color:white;
      }
      .color[active] span {
        animation: wiggle 2s infinite;
      }
      label {
        color:white;
      }
      input {
        margin-bottom:8px;
        padding:4px 8px;
        border-radius: 4px;
        border:none;
        background:#fff;
      }
      @keyframes wiggle {
        0% {
          transform:translateY(-100%);
        }
        50% {
          transform:translateY(-150%);
        }
        100% {
          transform:translateY(-100%);
        }
      }
    `
  }

  firstUpdated(changedProps) {
    this.addEventListener('click', event => {
      console.log(event);
      if(event.target !== this) return;
      this.close.bind(this)
    });
  }
  static get properties() {
    return { 
      chosenColor: {
        type: String
      }
    };
  }

  chooseColor(color) {
    this.chosenColor = color;
    this.dispatchEvent(new CustomEvent('pantone-color-chosen'));
  }

  close() {
    this.dispatchEvent(new CustomEvent('pantone-color-cancelled'));
  }

  async open() {
    return new Promise((resolve, reject) => {
      this.toggleAttribute('open');
      
      this.addEventListener('pantone-color-chosen', event => {
        resolve(this.chosenColor);
        this.toggleAttribute('open');
      }, {once: true});
      this.addEventListener('pantone-color-cancelled', event => {
        reject();
        this.toggleAttribute('open');
      }, {once: true})
    })
  }

  _scrollToColor({ target: input }) {
    let { value: code } = input;
    if(!code) return;
    if(/^\d{3,}/.test(code)) code = `${code.substr(0, 2)}-${code.substr(2)}`;
    const firstElement = this.shadowRoot.querySelector(`[id^="${code}"]`);
    firstElement.scrollIntoView({block: "center"});
    Array.from(this.shadowRoot.querySelectorAll('[active]')).forEach(ele => ele.toggleAttribute('active'));
    firstElement.toggleAttribute('active');
  }

  render() {
    return html`
      <div id='dialog'>
        <div id='header'>
          <label>
            Pantone Number:
            <input type='text' id='pantoneNumber' .value=${this.chosenColor?.code || ""} @input=${this._scrollToColor} @click=${event => this.chosenColor = {}} />
          </label>
        </div>
        <main>
          ${pantoneColors.map(color => html`
            <button id=${color.code.replace(/ /, '')} class='color' @click=${event => this.chooseColor(color)} style='background-color:rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b});'>
              <span>${color.name}</span>
            </button>
          `)}
        </main>
      </div>
    `;
  }
}
customElements.define('pantone-picker', PantonePicker);