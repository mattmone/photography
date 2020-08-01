import { pantoneColors } from '../pantone-colors.js';
import './pantone-picker.js';

export class ImageCreator extends HTMLElement {
  constructor() {
    super();
  }
  static get template() {
    return ;
  }
  connectedCallback() {
    // var importDoc = document.currentScript.ownerDocument; // importee
    // var template = importDoc.querySelector('#creator-template');
    // import template into
    // var clone = importDoc.importNode(template.content, true);
    this.root = this.attachShadow({
      mode: "open"
    });
    // let root = document.createElement("div");
    // root.innerHTML = this.template;
    // console.log(this.shadowRoot);
    this.root.innerHTML = `
    <style>
      :host {
        display: flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        width:100%;
        height: 100%;
        padding: 0;
        margin:0;
        background-color:#eee;
      }
      :host, :host * {
        box-sizing: border-box;
      }
      #templateCanvas {
        width: 100%;
        box-shadow: 0 0 8px #666;
        background-color:white;
      }
      button {
        border:none;
        color: white;
        flex-grow:1;
        font-size: 35px;
        text-transform: uppercase;
        text-shadow: 1px 1px 0px #555, 1.5px 1.5px 0px #555;
        font-family: Steelfish, monospace;
        display:flex;
        align-items:center;
        justify-content:center;
      }
      #startButton {
        background-color: rgb(255, 157, 110);
      }
      #saveButton {
        background-color:rgb(221, 127, 211);
      }
      #saveButton.sent {
        background-color: rgb(254, 209, 65);
      }
      #saveButton.sending {
        animation: sending 0.5s infinite alternate;
      }
      @keyframes sending {
        0% { background-color: rgb(221, 127, 211); }
        100% { background-color: rgb(254, 209, 65); }
      }
      #photoButton {
        background-color:rgb(139, 184, 232);
        width:100%;
        flex: 1;
      }
      #typeSelect, .sizeSelect {
        position:absolute;
        z-index:2;
        width: 87px;
        opacity: 0;
        height: 72px;
      }
      #typeSelect {
        left: 0;
        top: 50%;
        transform:translateY(-50%);
      }
      .sizeSelect {
        right: 0;
        top: 50%;
        transform:translateY(-50%);
      }
      #kidsSelect, #leggingsSelect {
        display:none;
      }
      #startButton, #saveButton {
        width: 50%;
      }
      #pantoneColors, #pantoneClear {
        width: 100%;
      }
      #canvas-holder {
        flex-grow:1;
        align-items:center;
        justify-content:center;
        display:flex;
        position:relative;
      }
      .side-by-side-container {
        display:flex;
        flex-direction:row;
        flex-grow:0;
        width:100%;
      }
      .photo-buttons {
        min-height: 120px;
      }
      #adjustments {
        max-height: 40px;
        height: 40px;
        align-items:center;
        justify-content:stretch;
        display:flex;
        background-color: rgba(0,0,0,0.2);
      }
      #adjustments button {
        height: 100%;
        background-color: rgba(255,2550,255,0.2);
      }
      svg {
        flex: 1;
      }
      input {
        width: 0;
        overflow:hidden;
        transition:width 0.4s;
      }
      input[open] {
        width: 50vw;
      }
      [hidden] {
        display:none !important;
      }
    </style>
    <pantone-picker></pantone-picker>
    <div id='adjustments' class='side-by-side-container'>
      <button id='contrast' class='adj'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
      </button>
      <input for='contrast' type='range' min='60' value='100' reset='100' max='140' />
      <button id='brightness' class='adj'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>
      </button>
      <input for='brightness' type='range' min='60' value='100' reset='100' max='140' />
      <button id='hue' class='adj'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
      </button>
      <input for='hue' type='range' min='-45' value='0' reset='0' max='45' />
      <button id='saturation' class='adj'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16l-7-8v8H5l7-8V5h7v14z"/></svg>
      </button>
      <input for='saturation' type='range' min='0' value='100' reset='100' max='100' />
    </div>
    <div id='canvas-holder'>
      <canvas id='templateCanvas' width='1700' height='1700'></canvas>
      <select id='typeSelect'>
        <option value='Pick'>Pick</option>
        <option value='Amy' sizes='reg'>Amy</option>
        <option value='Amelia' sizes='reg'>Amelia</option>
        <option value='Ana' sizes='reg'>Ana</option>
        <option value='Azure' sizes='reg'>Azure</option>
        <option value='Carly' sizes='reg'>Carly</option>
        <option value='Caroline' sizes='reg'>Caroline</option>
        <option value='Cassie' sizes='reg'>Cassie</option>
        <option value='Cici' sizes='reg'>Cici</option>
        <option value='Christy T' sizes='reg'>Christy T</option>
        <option value='Classic T' sizes='reg'>Classic T</option>
        <option value='Debbie' sizes='reg'>Debbie</option>
        <option value='Deanne Skirt' sizes='reg'>Deanne Skirt</option>
        <option value='Deanne II' sizes='reg'>Deanne II</option>
        <option value='Georgia' sizes='reg'>Georgia</option>
        <option value='Gigi' sizes='reg'>Gigi</option>
        <option value='Harvey' sizes='reg'>Harvey</option>
        <option value='Hudson' sizes='reg'>Hudson</option>
        <option value='Hudson LS' sizes='reg'>Hudson LS</option>
        <option value='Iris' sizes='reg'>Iris</option>
        <option value='Irma' sizes='reg'>Irma</option>
        <option value='Jade' sizes='reg'>Jade</option>
        <option value='Jax' sizes='reg'>Jax</option>
        <option value='Jaxon' sizes='reg'>Jaxon</option>
        <option value='Jessie' sizes='reg'>Jessie</option>
        <option value='Jill' sizes='reg'>Jill</option>
        <option value='Jordan' sizes='reg'>Jordan</option>
        <option value='Julia' sizes='reg'>Julia</option>
        <option value='Kenny' sizes='reg'>Kenny</option>
        <option value='Kristina' sizes='reg'>Kristina</option>
        <option value='Joy' sizes='reg'>Joy</option>
        <option value='Lindsay' sizes='reg'>Lindsay</option>
        <option value='Liv' sizes='reg'>Liv</option>
        <option value='Lola' sizes='reg'>Lola</option>
        <option value='Lynnae' sizes='reg'>Lynnae</option>
        <option value='Madison' sizes='reg'>Madison</option>
        <option value='Maria' sizes='reg'>Maria</option>
        <option value='Mark' sizes='reg'>Mark</option>
        <option value='Maxi' sizes='reg'>Maxi</option>
        <option value='Michael' sizes='reg'>Michael</option>
	      <option value='Morgan' sizes='reg'>Morgan</option>
        <option value='Nicole' sizes='reg'>Nicole</option>
        <option value='Nicki' sizes='reg'>Nicki</option>
        <option value='Olive' sizes='reg'>Olive</option>
        <option value='Patrick' sizes='reg'>Patrick</option>
        <option value='Perfect T' sizes='reg'>Perfect T</option>
        <option value='Perfect Tank' sizes='reg'>Perfect Tank</option>
        <option value='Poppy' sizes='reg'>Poppy</option>
        <option value='Randy' sizes='reg'>Randy</option>
        <option value='Sarah' sizes='reg'>Sarah</option>
        <option value='Shirley' sizes='reg'>Shirley</option>
        <option value='Tank Top' sizes='reg'>Tank Top</option>
        <option value='Vintage T' sizes='reg'>Vintage T</option>
        <option value='Leggings' sizes='leggings'>Leggings</option>
      </select>
      <select id='regSelect' class='sizeSelect'>
        <option value='Pick'>Pick</option>
        <option value='XXS'>XXS</option>
        <option value='XS'>XS</option>
        <option value='S'>S</option>
        <option value='M'>M</option>
        <option value='L'>L</option>
        <option value='XL'>XL</option>
        <option value='2XL'>2XL</option>
        <option value='3XL'>3XL</option>
      </select>
      <select id='kidsSelect' class='sizeSelect'>
        <option value='Pick'>Pick</option>
        <option value='2'>2</option>
        <option value='4'>4</option>
        <option value='6'>6</option>
        <option value='8'>8</option>
        <option value='10'>10</option>
        <option value='12'>12</option>
        <option value='14'>14</option>
      </select>
      <select id='leggingsSelect' class='sizeSelect'>
        <option value='Pick'>Pick</option>
        <option value='S/M'>S/M</option>
        <option value='L/XL'>L/XL</option>
        <option value='Tween'>Tween</option>
        <option value='OS'>OS</option>
        <option value='TC'>TC</option>
        <option value='TC2'>TC2</option>
      </select>
    </div>
    <button id='pantoneColors'>Pantone</button>
    <div class='side-by-side-container photo-buttons'>
      <button id='photoButton' style='display:none;'>Shoot</button>
      <button id='startButton'>Start</button>
      <button id='saveButton' style='display:none;'>Save</button>
    </div>
    `;
    // this.root.appendChild(root);
    requestAnimationFrame(_ => {
      this.root.querySelector('#startButton').addEventListener('click', e => this.startStream());
      this.root.querySelector('#photoButton').addEventListener('click', e => this.capturePhoto());
      this.root.querySelector('#saveButton').addEventListener('click', e => this.savePhoto());
      this.root.querySelector('#typeSelect').addEventListener('change', this.typeSelection.bind(this));
      this.root.querySelector('#pantoneColors').addEventListener('click', this.pantoneClick.bind(this));
      Array.from(this.root.querySelectorAll('button.adj')).forEach(btn => {
        btn.relatedInput = this.root.querySelector(`input[for=${btn.id}]`);
        btn.addEventListener('click', event => {
          if(!this.fullSizeImage) return;
          const alreadyOpen = btn.relatedInput.hasAttribute('open');
          Array.from(this.root.querySelectorAll('input[type=range]')).forEach(inp => inp.toggleAttribute('open', false));
          if(!alreadyOpen)
            btn.relatedInput.toggleAttribute('open');
        });
        btn.relatedInput.addEventListener('input', event => {
          const filter = btn.relatedInput.getAttribute('for');
          const value = btn.relatedInput.value;
          this.filter[filter] = value;
          this.drawCanvas(this.context, this.fullSizeImage);
          this.drawCloseup(this.context, this.fullSizeImage);
          this.drawCloseup(this.context, this.fullSizeImage, true);
          this.drawWatermark(this.context);
        })
      })
      this.filter = {};
      Array.from(this.root.querySelectorAll('.sizeSelect')).map(ss => ss.addEventListener('change', this.sizeSelection.bind(this)))
      this.templateCanvas = this.root.querySelector('#templateCanvas');
      this.context = this.templateCanvas.getContext('2d');
      this.setupTemplate(this.context);
    })
  }
  async pantoneClick() {
    const pantoneColor = await this.shadowRoot.querySelector('pantone-picker').open();
    // const pantoneColor = prompt("Enter the Pantone Color code", "");
    if(pantoneColor) {
      this.pantoneID = pantoneColor.code; 
		  this.pantoneColor = `rgb(${pantoneColor.rgb.r},${pantoneColor.rgb.g},${pantoneColor.rgb.b})`;
		  this.pantoneName = pantoneColor.name;
      this.drawCloseup(this.context, null);
      this.drawCloseup(this.context, null, true);
      this.drawCanvas(this.context, null);
      this.drawWatermark(this.context);
      let saveButton = this.root.querySelector('#saveButton');
      saveButton.innerText = 'Save';
      saveButton.classList.remove('sent');
      this.setStateStartSave();
      return;
    }
  }
  async savePhoto() {
    let saveButton = this.root.querySelector('#saveButton');
    saveButton.innerText = 'Sending';
    saveButton.classList.add('sending');
    var formData = new FormData();

    formData.append("type", this.selectedType);
    formData.append("size", this.selectedSize); // number 123456 is immediately converted to a string "123456"
    
    // JavaScript file-like object
    var content = '<a id="a"><b id="b">hey!</b></a>'; // the body of the new file...
    var blob = await (new Promise(resolve => {
      this.templateCanvas.toBlob(function(blob){
        resolve(blob);
      }, 'image/jpeg', 0.95);
    }));
    formData.append("image", blob);
    let finish = this.completeSave.bind(this);
    fetch("https://mattmone.duckdns.org/mysql-api/creator", {
      method: "POST",
      body: formData
    }).then(finish);
    // var request = new XMLHttpRequest();
    // request.addEventListener("load", this.completeSave.bind(this));
    // request.open("POST", "https://mattmone.duckdns.org/mysql-api/creator");
    // request.send(formData);
  }
  completeSave(e) {
    let saveButton = this.root.querySelector('#saveButton');
    saveButton.classList.remove('sending');
    saveButton.innerText = 'Sent!';
    saveButton.classList.add('sent');
  }
  typeSelection(e) {
    this.selectedType = e.target.options[e.target.selectedIndex].value;
    let sizeSelector = e.target.options[e.target.selectedIndex].getAttribute('sizes');
    Array.from(this.root.querySelectorAll('.sizeSelect')).map(ss => ss.style.display = 'none');
    this.root.querySelector(`#${sizeSelector}Select`).style.display = 'block';
    this.drawType(this.selectedType, this.context);
  }
  sizeSelection(e) {
    this.selectedSize = e.target.options[e.target.selectedIndex].value;
    this.drawSize(this.selectedSize, this.context);
  }
  async setupTemplate(context) {
    this.sidebar = 370, this.canvasSide = 1700;
		this.imageSpecs = {
			top: 0,
			left: this.sidebar,
			height: 1700,
			width: 960,
			ratio: 1700 / 960
		};
    this.selectableSizes = 300;
    
    this.dragonfly = document.createElement('img');
    this.dragonfly.addEventListener("load", (() => 
      this.drawWatermark(this.context))
    , false);
		this.dragonfly.src = "/_static/photography/images/dragonfly.svg";
		this.drawSize(" ", this.context);
		this.drawType(" ", this.context);
		setTimeout(_ => {
		  this.drawSize("pick", this.context);
		  this.drawType("pick", this.context);
		}, 500);
  }
  drawWatermark(context) {
    context.fillStyle = "rgba(0,0,0,0.4)";
    context.fillRect(this.sidebar, this.canvasSide-(this.sidebar*1.5), this.imageSpecs.width, this.sidebar);
    context.drawImage(this.dragonfly, this.canvasSide-this.sidebar-this.sidebar/2*1.1, this.canvasSide-(this.sidebar)-20, this.sidebar/2/1.1, this.sidebar/2);
		context.font = "120px 'Steelfish'";
		context.textBaseline = "middle";
		context.textAlign = "center";
		context.fillStyle = "#555";
		context.fillText("Jasmine Mone", this.canvasSide/2 + 5, this.canvasSide-(this.sidebar*1.5)+this.sidebar/2 + 5);
		context.fillStyle = "#FFF";
		context.fillText("Jasmine Mone", this.canvasSide/2, this.canvasSide-(this.sidebar*1.5)+this.sidebar/2);   
		context.strokeStyle = 'rgba(255,255,255)';
		context.lineWidth = 5;
		let logoSide = 160;
		let logoWidth = 25;
		for (let i = 0; i<7; i++)
		  context.strokeRect(this.sidebar + 30 + i*logoWidth/2, this.canvasSide-(this.sidebar*1.5) + 30 + i*logoWidth/2, logoSide - i*logoWidth, logoSide - i*logoWidth);
		context.fillRect(this.sidebar + 30 + 6*logoWidth/2, this.canvasSide-(this.sidebar*1.5) + 30 + 6*logoWidth/2, logoSide - 6*logoWidth, logoSide - 6*logoWidth);
		// context.strokeRect(this.sidebar + 30, this.canvasSide-(this.sidebar*1.5) + 30, 160, 160);
		// context.strokeRect(this.sidebar + 40, this.canvasSide-(this.sidebar*1.5) + 40, 140, 140);
		// context.strokeRect(this.sidebar + 50, this.canvasSide-(this.sidebar*1.5) + 50, 120, 120);
		// context.strokeRect(this.sidebar + 60, this.canvasSide-(this.sidebar*1.5) + 60, 100, 100);
		// context.strokeRect(this.sidebar + 70, this.canvasSide-(this.sidebar*1.5) + 70, 80, 80);
		// context.strokeRect(this.sidebar + 80, this.canvasSide-(this.sidebar*1.5) + 80, 60, 60);
  }
  drawSize(size, context) {
		if(!size)
			return;
		context.fillStyle = "#F67599";
		context.fillRect(this.canvasSide - this.sidebar, this.canvasSide/2 - this.selectableSizes/2, this.sidebar, this.selectableSizes);
		context.font = "90px 'Steelfish'";
		context.textBaseline = "middle";
		context.textAlign = "center";
		context.fillStyle = "#555";
		context.fillText(size.toUpperCase() || "Pick", this.canvasSide - this.sidebar/2 + 5, this.canvasSide/2 + 5);
		context.fillStyle = "#FFF";
		context.fillText(size.toUpperCase() || "Pick", this.canvasSide - this.sidebar/2, this.canvasSide/2);
	}
	drawType(type, context) {
		if(!type)
			return;
		context.fillStyle = "#9595D2";
		context.fillRect(0, this.canvasSide/2 - this.selectableSizes/2, this.sidebar, this.selectableSizes);
		context.font = "90px 'Steelfish'";
		context.textBaseline = "middle";
		context.textAlign = "center";
		context.fillStyle = "#555";
		context.fillText(type.toUpperCase() || "PICK", this.sidebar/2 + 5, this.canvasSide/2 + 5);
		context.fillStyle = "#FFF";
		context.fillText(type.toUpperCase() || "PICK", this.sidebar/2, this.canvasSide/2);
	}
  async capturePhoto() {
    this.feedStart = false;
    let blob;
    try {
      blob = await this.imageCapture.takePhoto();
    } catch(error) {
      console.log(error);
    }
    this.mediaStreamTrack.stop();
    try {
    this.fullSizeImage = await createImageBitmap(blob);
    } catch(error) {
      console.log(error);
    }
    // this.templateCanvas.width = imageBitmap.width;
    // this.templateCanvas.height = imageBitmap.height;
    // var canvasBox = this.templateCanvas.getBoundingClientRect();
    // this.templateCanvas.style.height = ((imageBitmap.height / imageBitmap.width) * canvasBox.width)+'px';
    this.drawCanvas(this.context, this.fullSizeImage);
    this.drawCloseup(this.context, this.fullSizeImage);
    this.drawCloseup(this.context, this.fullSizeImage, true);
    this.drawWatermark(this.context);
    // this.context.drawImage(imageBitmap, 0, 0);
    this.setStateStartSave();
  }

  setStateStartSave() {
    requestAnimationFrame(_ => {
      this.root.querySelector('#startButton').style.display = "block";
      this.root.querySelector('#saveButton').style.display = "block";
      this.root.querySelector('#photoButton').style.display = "none";
    })
  }
  async _setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
      return;
    }
    // var constraints = navigator.mediaDevices.getSupportedConstraints();
    // logOutput(constraints);
    let devices = await navigator.mediaDevices.enumerateDevices()
    let cameraid;
    devices.forEach(function(device) {
      if (device.label.indexOf('back') > -1)
        cameraid = device.deviceId;
    });
    this.constraints = {
      audio: false,
      video: (cameraid ? {
        deviceId: {exact: cameraid}
      } : true)
    };

    this.mediaStream = await navigator.mediaDevices.getUserMedia(this.constraints)
    this.mediaStreamTrack = this.mediaStream.getVideoTracks()[0];
    this.imageCapture = await new ImageCapture(this.mediaStreamTrack);
    // const photoCapabilities = await this.imageCapture.getPhotoCapabilities();
  }
  async startStream() {
    // document.documentElement.webkitRequestFullScreen();
    // await screen.orientation.lock('portrait');
    
    delete this.pantoneID;
    await this._setupCamera();
    Array.from(this.root.querySelectorAll('input[type=range]')).forEach(range => range.value = range.getAttribute('reset'));
    this.filter = {};
    let saveButton = this.root.querySelector('#saveButton');
    this.root.querySelector('#startButton').style.display = "none";
    saveButton.style.display = "none";
    saveButton.classList.remove('sent');
    saveButton.innerText = 'Save';
    this.root.querySelector('#photoButton').style.display = "block";
    this.feedStart = true;
    this.startFeed();
  }
  async startFeed() {
    requestAnimationFrame(async _ => {
      let imageBitmap
      try {
        imageBitmap = await this.imageCapture.grabFrame();
      } catch(imgError) {
        console.log(imgError);
      }
      if(!imageBitmap) return;
      this.drawCanvas(this.context, imageBitmap);
      this.drawCloseup(this.context, imageBitmap);
      this.drawCloseup(this.context, imageBitmap, true);
      this.drawWatermark(this.context);
      // this.context.drawImage(imageBitmap, 0, 0);
      if(this.feedStart) this.startFeed();
    })
  }
  drawCloseup(context, img, left) {
    let rotate = false;
		context.save();
		context.beginPath();
		context.rect(left ? 0 : this.canvasSide - this.sidebar, 0, this.sidebar, 1700);
		context.clip();
		if(this.pantoneID) {
		  context.fillStyle = this.pantoneColor;
		  context.fillRect(0,0,this.canvasSide,this.canvasSide);
		  context.fillStyle = 'white';
		  context.textBaseline = "top";
		  context.textAlign = "left";
		  context.font = "125px 'Steelfish'";
		  context.translate(this.canvasSide/2, this.canvasSide/2);
		  context.rotate(left ? 270 * Math.PI/180 : 90 * Math.PI/180);
		  context.fillText(left ? this.pantoneName : `PANTONE ${this.pantoneID}`, -this.canvasSide/2+10, -this.canvasSide/2+10);
		  context.restore();
		  this.drawSize(this.selectedSize || "pick", this.context);
      this.drawType(this.selectedType || "pick", this.context);
		  return;
		}
    if(img.width > img.height) rotate = true;
		let leftStart = this.canvasSide - this.sidebar;
		let photoSpecs = {
		  width: rotate ? 4032 : 3024,
		  height: rotate ? 3024 : 4032
		};
		let spaceSpecs = {
		  width: this.sidebar,
		  height: this.canvasSide
		};
		let coords = {
      x: leftStart,
      y: 0,
      width: photoSpecs.width,
      height: photoSpecs.height
    };
    // if(rotate) {
    //   context.translate(photoSpecs.width, 0);
    //   coords.x = coords.x - coords.width/2 + 500;
    //   coords.y = coords.y - coords.height/2 + 500;
    //   context.translate(coords.width/2, coords.height/2);
    // }
    const {contrast, brightness, hue, saturation} = this.filter;
    const filter = [contrast ? `contrast(${contrast}%)` : "", brightness ? `brightness(${brightness}%)` : "", hue ? `hue-rotate(${hue}deg)` : "", saturation ? `saturate(${saturation}%)` : ""];
    context.filter = filter.join(" ");
    context.translate(left ? this.sidebar/2 + 350 : this.canvasSide - this.sidebar/2 + 150, this.canvasSide/2-920);
    let {width, height} = photoSpecs;
    if(rotate) {
      context.translate(this.canvasSide/1.6, this.canvasSide/2.6);
      context.rotate(90 * Math.PI/180);
      // photoSpecs.width = height;
      // photoSpecs.height = width;
    }
		context.drawImage(img, -(photoSpecs.width / 2 - this.sidebar/2), -(photoSpecs.height / 2 - this.canvasSide / 2), photoSpecs.width, photoSpecs.height);
		context.restore();
    this.drawSize(this.selectedSize || "pick", this.context);
    this.drawType(this.selectedType || "pick", this.context);

		
	}
  drawCanvas(context, img) {
    context.save();
    context.beginPath();
    context.rect(this.sidebar, 0, 960, 1700);
    context.clip();
    if(this.pantoneID) {
		  context.fillStyle = this.pantoneColor;
		  context.fillRect(0,0,this.canvasSide,this.canvasSide);
		  context.restore();
		  return;
		}
    let rotate = false;
    let ratioX = 960, ratioY = 1700;
    if(img.width > img.height) {
      rotate = true;
      ratioX = 1700;
      ratioY = 960;
    }
    let ratio  = Math.max(ratioX / img.width, ratioY / img.height);
    let coords = {
      x: this.sidebar - ((ratio*img.width - 960)/2),
      y: 0,
      width: ratio*img.width,
      height: ratio*img.height
    };
    context.translate(this.sidebar, 0);
    if(rotate) {
      context.translate(coords.width-450, 0);
      context.rotate(90 * Math.PI/180);
    }
    const {contrast, brightness, hue, saturation} = this.filter;
    const filter = [contrast ? `contrast(${contrast}%)` : "", brightness ? `brightness(${brightness}%)` : "", hue ? `hue-rotate(${hue}deg)` : "", saturation ? `saturate(${saturation}%)` : ""];
    context.filter = filter.join(" ");
    context.drawImage(img, 0, 0, coords.width, coords.height);
    context.restore();
  }
}
customElements.define('img-creator', ImageCreator);
