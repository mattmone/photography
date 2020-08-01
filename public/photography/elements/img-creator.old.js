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
      }
      :host, :host * {
        box-sizing: border-box;
      }
      #templateCanvas {
        width: 100%;
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
        position:fixed;
        z-index:2;
        right: 0;
        width: 84px;
        opacity: 0;
      }
      #typeSelect {
        top: 187px;
        height: 43px;
      }
      .sizeSelect {
        top: 229px;
        height: 85px;
      }
      #kidsSelect, #leggingsSelect {
        display:none;
      }
      #startButton, #saveButton {
        width: 50%;
      }
      .side-by-side-container {
        display:flex;
        flex-direction:row;
        flex-grow:1;
        width:100%;
      }
      #adjustments {
        max-height: 40px;
        height: 40px;
        align-items:center;
        justify-content:stretch;
        display:flex;
        background-color: #eee;
      }
      #adjustments button {
        height: 100%;
        background-color: #eee;
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
    </style>
    <canvas id='templateCanvas' width='1700' height='2048'></canvas>
    <select id='typeSelect'>
      <option value='Pick'>Pick</option>
      <option value='Amy' sizes='reg'>Amy</option>
      <option value='Amelia' sizes='reg'>Amelia</option>
      <option value='Ana' sizes='reg'>Ana</option>
      <option value='Azure' sizes='reg'>Azure</option>
      <option value='Carly' sizes='reg'>Carly</option>
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
      <option value='Irma' sizes='reg'>Irma</option>
      <option value='Jade' sizes='reg'>Jade</option>
      <option value='Jaxon' sizes='reg'>Jaxon</option>
      <option value='Jill' sizes='reg'>Jill</option>
      <option value='Jordan' sizes='reg'>Jordan</option>
      <option value='Julia' sizes='reg'>Julia</option>
      <option value='Kenny' sizes='reg'>Kenny</option>
      <option value='Joy' sizes='reg'>Joy</option>
      <option value='Lindsay' sizes='reg'>Lindsay</option>
      <option value='Lola' sizes='reg'>Lola</option>
      <option value='Lynnae' sizes='reg'>Lynnae</option>
      <option value='Madison' sizes='reg'>Madison</option>
      <option value='Maria' sizes='reg'>Maria</option>
      <option value='Mark' sizes='reg'>Mark</option>
      <option value='Maxi' sizes='reg'>Maxi</option>
      <option value='Michael' sizes='reg'>Michael</option>
      <option value='Nicole' sizes='reg'>Nicole</option>
      <option value='Patrick' sizes='reg'>Patrick</option>
      <option value='Perfect T' sizes='reg'>Perfect T</option>
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
    <div class='side-by-side-container'>
      <button id='photoButton' style='display:none;'>Shoot</button>
      <button id='startButton'>Start</button>
      <button id='saveButton' style='display:none;'>Save</button>
    </div>
    <div id='adjustments' class='side-by-side-container'>
      <button id='contrast' class='adj'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
      </button>
      <input for='contrast' type='range' min='0' value='100' reset='100' max='100' />
      <button id='brightness' class='adj'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>
      </button>
      <input for='brightness' type='range' min='0' value='100' reset='100' max='200' />
      <button id='hue' class='adj'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
      </button>
      <input for='hue' type='range' min='0' value='0' reset='0' max='360' />
      <button id='saturation' class='adj'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16l-7-8v8H5l7-8V5h7v14z"/></svg>
      </button>
      <input for='saturation' type='range' min='0' value='100' reset='100' max='100' />
    </div>`;
    // this.root.appendChild(root);
    requestAnimationFrame(_ => {
      this.root.querySelector('#startButton').addEventListener('click', e => this.startStream());
      this.root.querySelector('#photoButton').addEventListener('click', e => this.capturePhoto());
      this.root.querySelector('#saveButton').addEventListener('click', e => this.savePhoto());
      this.root.querySelector('#typeSelect').addEventListener('change', this.typeSelection.bind(this));
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
        })
      })
      this.filter = {};
      Array.from(this.root.querySelectorAll('.sizeSelect')).map(ss => ss.addEventListener('change', this.sizeSelection.bind(this)))
      this.templateCanvas = this.root.querySelector('#templateCanvas');
      this.context = this.templateCanvas.getContext('2d');
      this.setupTemplate(this.context);
      
    })
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
    fetch("https://mattmone.duckdns.org/mysql-api/creator", {
      method: "POST",
      body: formData
    })
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
    this.logoHT = 200, this.canvasWidth = 1700;
		this.imageSpecs = {
			top: 0,
			left: this.logoHT,
			height: 2048,
			width: 1156,
			ratio: 2048 / 1156
		};
    this.sizes = {
			type: this.canvasWidth - (this.canvasWidth - (1156 + this.logoHT)) - (320 / 357 * 900) - (2048 - ((1156 + this.logoHT) + 320)),
			size: this.canvasWidth - (1156 + this.logoHT),
		}
    context.fillStyle = "#64CCC9";
    context.fillRect(0, 0, 200, 2048);
    
    let logo = document.createElement('img');
    logo.addEventListener("load", (() => context.drawImage(logo, 0, 1024 - ((this.logoHT / 284 * 1800) / 2), this.logoHT, this.logoHT / 284 * 1800)).bind(this), false);
		logo.src = "images/rotated-llr-logo-vert-jm.png";
		this.drawSize(" ", this.context);
		this.drawType(" ", this.context);
		setTimeout(_ => {
		  this.drawSize("pick", this.context);
		  this.drawType("pick", this.context);
		}, 500);
  }
  drawSize(size, context) {
		if(!size)
			return;
		context.fillStyle = "#F67599";
		context.fillRect(1156 + this.logoHT, 1024 - ((this.logoHT / 357 * 900) / 2) + this.sizes.type, this.canvasWidth - (1156 + this.logoHT), this.sizes.size);
		context.font = "150px 'Steelfish'";
		context.textBaseline = "middle";
		context.textAlign = "center";
		context.fillStyle = "#555";
		context.fillText(size.toUpperCase() || "Select Size", (1156 + this.logoHT) + (this.sizes.size / 2) + 5, ((1024 - ((this.logoHT / 357 * 900) / 2) + this.sizes.type) + this.sizes.size / 2) + 5);
		context.fillStyle = "#FFF";
		context.fillText(size.toUpperCase() || "Select Size", (1156 + this.logoHT) + (this.sizes.size / 2), (1024 - ((this.logoHT / 357 * 900) / 2) + this.sizes.type) + this.sizes.size / 2);
	}
	drawType(type, context) {
		if(!type)
			return;
		context.fillStyle = "#9595D2";
		context.fillRect(1156 + this.logoHT, 1024 - ((this.logoHT / 357 * 900) / 2), this.canvasWidth - (1156 + this.logoHT), this.sizes.type);
		context.font = "90px 'Steelfish'";
		context.textBaseline = "middle";
		context.textAlign = "center";
		context.fillStyle = "#555";
		context.fillText(type.toUpperCase() || "Select Type", (1156 + this.logoHT) + (this.sizes.size / 2) + 5, (1024 - ((this.logoHT / 357 * 900) / 2) + this.sizes.type / 2) + 5);
		context.fillStyle = "#FFF";
		context.fillText(type.toUpperCase() || "Select Type", (1156 + this.logoHT) + (this.sizes.size / 2), (1024 - ((this.logoHT / 357 * 900) / 2) + this.sizes.type / 2));
	}
  async capturePhoto() {
    this.feedStart = false;
    let blob = await this.imageCapture.takePhoto();
    this.mediaStreamTrack.stop();
    this.fullSizeImage = await createImageBitmap(blob);
    // this.templateCanvas.width = imageBitmap.width;
    // this.templateCanvas.height = imageBitmap.height;
    // var canvasBox = this.templateCanvas.getBoundingClientRect();
    // this.templateCanvas.style.height = ((imageBitmap.height / imageBitmap.width) * canvasBox.width)+'px';
    this.drawCanvas(this.context, this.fullSizeImage);
    this.drawCloseup(this.context, this.fullSizeImage);
    // this.context.drawImage(imageBitmap, 0, 0);
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
      // this.context.drawImage(imageBitmap, 0, 0);
      if(this.feedStart) this.startFeed();
    })
  }
  drawCloseup(context, img) {
    let rotate = false;
    if(img.width > img.height) rotate = true;
		context.save();
		context.beginPath();
		context.rect(this.logoHT + 1156, 0, 1700 - 1156 - this.logoHT, 2048);
		context.clip();
		let leftStart = this.logoHT + this.imageSpecs.width
		let photoSpecs = {
		  width: rotate ? 4032 : 3024,
		  height: rotate ? 3024 : 4032
		};
		let spaceSpecs = {
		  width: (1700 - 1156 - this.logoHT),
		  height: 2048
		};
		let coords = {
      x: leftStart - ((photoSpecs.width - spaceSpecs.width)/2),
      y: 0-((photoSpecs.height - spaceSpecs.height)/2),
      width: photoSpecs.width,
      height: photoSpecs.height
    };
    if(rotate) {
      context.translate(coords.x, coords.y);
      coords.x = coords.x - coords.width/2 + 500;
      coords.y = coords.y - coords.height/2 + 500;
      context.translate(coords.width/2, coords.height/2);
      context.rotate(90 * Math.PI/180);
    }
    const {contrast, brightness, hue, saturation} = this.filter;
    const filter = [contrast ? `contrast(${contrast}%)` : "", brightness ? `brightness(${brightness}%)` : "", hue ? `hue-rotate(${hue}deg)` : "", saturation ? `saturate(${saturation}%)` : ""];
    context.filter = filter.join(" ");
		context.drawImage(img, coords.x, coords.y, coords.width, coords.height);
		context.restore();
    this.drawSize(this.selectedSize || "pick", this.context);
    this.drawType(this.selectedType || "pick", this.context);

		
	}
  drawCanvas(context, img) {
    let rotate = false;
    let ratioX = 1156, ratioY = 2048;
    if(img.width > img.height) {
      rotate = true;
      ratioX = 2048;
      ratioY = 1156;
    }
    let ratio  = Math.max(ratioX / img.width, ratioY / img.height);
    context.save();
    context.beginPath();
    context.rect(200, 0, 1156, 2048);
    context.clip();
    let coords = {
      x: this.logoHT - ((ratio*img.width - 1156)/2),
      y: 0,
      width: ratio*img.width,
      height: ratio*img.height
    };
    if(rotate) {
      context.translate(coords.x, coords.y);
      coords.x = coords.x - coords.width/4;
      coords.y = coords.y - coords.height/2;
      context.translate(coords.width/2, coords.height/2);
      context.rotate(90 * Math.PI/180);
    }
    const {contrast, brightness, hue, saturation} = this.filter;
    const filter = [contrast ? `contrast(${contrast}%)` : "", brightness ? `brightness(${brightness}%)` : "", hue ? `hue-rotate(${hue}deg)` : "", saturation ? `saturate(${saturation}%)` : ""];
    context.filter = filter.join(" ");
    context.drawImage(img, coords.x, coords.y, coords.width, coords.height);
    context.restore();
  }
}
customElements.define('img-creator', ImageCreator);