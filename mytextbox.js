/* define my own textbox class */

const __myTextBox_lib = new myTextBox_StaticMethods();

function myTextBox_StaticMethods()
{
	this.clickhandle = function (event){
		if (this.onclick)
			this.onclick.call(this, event);
	}

	this.keypresshandle = function(event){
		if (this.onkeypress)
			this.onkeypress.call(this, event);
		
		if ( event.key.length == 1 || event.key == 'Backspace' ){		
			if( this.onchange )
				this.onchange.call(this);
		}
		if ( event.key.length == 1 || event.key == 'Backspace' ){
		/* validate this keystroke, giving ourselves a little bit of 
		   a timeout for the dom value to become updated */
		setTimeout( this.validate.bind(this), 25);
		}
	}

	this.blurhandle = function(event){
		this.isfocused = 0;
		if (this.onblur)
			this.onblur.call(this, event);
		this.validate.call(this);
		this.draw();
	}

	this.focushandle = function(event){
		this.isfocused = 1;
		if (this.onclick)
			this.onclick.call(this, event);
		this.validate.call(this);
		this.draw();
	}
	
	this.validate = function(curValue){
		var isvalid = 0;
		
		if ( ! this.dom )
			return;
		
		if ( ! curValue )
			curValue = this.dom.value;
		
		/* check if a custom validation method is defined */
		if ( this.validmethod )
			 isvalid = this.validmethod.call(this);
		else {	
			isvalid = 1     /* innocent until proven guilty */	
		
			if ( this.validregex )
				isvalid = isvalid & this.validregex.test( curValue );
			
			if ( this.validlength && this.validlength.length < 2 ){
				isvalid = isvalid & ( curValue.length >= this.validlength[0] );
			}
			
			if ( this.validlength && this.validlength.length >= 2 ){
				isvalid = isvalid & ( curValue.length >= Math.min( this.validlength ) );
				isvalid = isvalid & ( curValue.length <= Math.max( this.validlength ) );
			}
			
			if ( this.validvalues ){
				isvalid = isvalid | ( this.validvalues.indexOf(curValue) >= 0 );
			}
		}
		
		/* here we will detect if this valid status changed */
		var statuschanged = this.isvalid ^ isvalid
		
		if(isvalid){
			this.isvalid = 1;
		 
			if ( this.onvalid && statuschanged == 1 ){
				ret = this.onvalid.call(this);
				this.draw();
			}
		}
		else{
			 this.isvalid = 0; 
		 
			 if ( this.oninvalid && statuschanged == 1 ){
				ret = this.oninvalid.call(this);
				this.draw();
			 }
		}
		
	}
	
	this.draw = function(){
		
		var base = this._baseclasses;
		var cur  = this.dom.className.split(/[ \t]+/);
		var i, redraw = 0;
		
		if ( !this.isvisible )
			return; 
		
		for ( i=0; i < base.length; i++ ){
			
			/* we need to add valid */
			if ( this.isvalid & cur.indexOf( base[i] + '-valid' ) < 0 ){
				redraw = 1;  cur.unshift(base[i] + '-valid');
			}

			/* we need to remove valid */
			if ( !this.isvalid & cur.indexOf( base[i] + '-valid' ) >= 0 ){
				redraw = 1;  cur.splice(cur.indexOf( base[i] + '-valid' ), 1);
			}
			
			/* we need to add focus */
			if ( this.isfocused & cur.indexOf( base[i] + '-focus' ) < 0 ){
				redraw = 1;  cur.unshift(base[i] + '-focus');
			}

			/* we need to remove focus */
			if ( !this.isfocused & cur.indexOf( base[i] + '-focus' ) >= 0 ){
				redraw = 1;  cur.splice(cur.indexOf( base[i] + '-focus' ), 1);
			}
		
		}
		
		if ( redraw ){
			this.dom.className = cur.join(' ');
			log.innerHTML += this.dom.name + '::draw() ' + this.dom.className + '<br>';
		}
	}
	
	this.verk = function(){
		alert('it werks, its werking');
	}
}

/* we will define our own structure to represent a textbox */
function myTextBox( name ){
	
	/* lookup the dom object specified */
	this.dom = undefined;
	var query         = document.getElementsByName(name);     
	
	if ( query.length == 1 )
		this.dom = query[0];
	else
		return undefined; 
		
	/* define common event functions to forward and define object handlers */ 
	this.isfocused    = 0;
	this.onclick      = undefined;
	this.onfocus      = undefined;
	this.onblur       = undefined;
	this.onkeypress   = undefined;
	this.onchange     = undefined;
	this.dom.addEventListener('click',    __myTextBox_lib.clickhandle.bind(this)    );
	this.dom.addEventListener('blur',     __myTextBox_lib.blurhandle.bind(this)     );
	this.dom.addEventListener('keyup',    __myTextBox_lib.keypresshandle.bind(this)    );
	this.dom.addEventListener('focus',    __myTextBox_lib.focushandle.bind(this)    );	
	
	/* input validation */
	this.isvalid     = 0; 								  /* valid data entered        */ 								
	this.validregex  = undefined;					      /* information used to help  */
	this.validvalues = undefined;                         /* validation information    */
	this.validlength = undefined;
	this.validmethod = undefined;                         /* function used to validate */
	this.onvalid     = undefined;
	this.oninvalid   = undefined;
	
	this.validate = __myTextBox_lib.validate;
		
	/* show method */
	
	this._lastdisplay = this.dom.style.display;
	this.isvisible   = 1;
	
	this.show      = function(){
		if (this.dom){
			this.dom.style.display = this._lastdisplay;
			this.visible = 1; 
			log.innerHTML += this.dom.name + '::show() ' + this.dom._lastdisplay + '<br>';
		}
	}
	
	/* hide method */
	this.hide      = function(){
		if (this.dom){
			this._lastdisplay      = this.dom.style.display;
			this.dom.style.display = 'none';
			this.visible = 0;
			log.innerHTML += this.dom.name + '::hide() ' + this.dom._lastdisplay + '<br>';
		}
		

	}
	
	/* gui handling */
	this._baseclasses = this.dom.className.split(/[ \t]+/);	
	this.draw = __myTextBox_lib.draw;
	
	this.ishighlighted = 0;
	
	this.highlight = function(){
		if ( !this.dom ) return;
		
		
	}
	
	
	return this;
}