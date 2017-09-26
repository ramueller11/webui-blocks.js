
function startup(){
	
	/* Here we bind all of the textboxes and comboboxes defined in the HTML code 
	   to focus and blur and validate handling events. */
	   
	var i, j, 
	    clsmembers = ['form-textbox', 'form-combobox'];
	
	for( j = 0; j < clsmembers.length; j++ ){
		var cntrls = document.getElementsByClassName(clsmembers[j]);
		
		for (i = 0; i < cntrls.length; i++) {
			if ( cntrls[i].name != undefined ){
				 cntrls[i].addEventListener('focus', focushandler);
				 cntrls[i].addEventListener('blur',  blurhandler);
				 cntrls[i].addEventListener('keyup', validatehandler);
				 validatehandler.call(cntrls[i]);
			}
		}
	}
	
	var picker = new Pikaday({ field: document.getElementById('datepicker') });
	
	return;
}

function blurhandler(){
	console.log('blur: ' + this.name );
	validatehandler()
	
	this.parentNode.className = this.parentNode.className.replace(/ controlframe-active/,'')
	
	/*
	instance.parentNode.style.background-color = 'white';
	instance.parentNode.parentNode.style.background-color = 'white';
	*/
}

function focushandler(){
	console.log('focus: ' + this.name );
	this.parentNode.className+=' controlframe-active'
	validatehandler.call(this)
	
	/*
	instance.style.background-color = 'yellow';
	instance.parentNode.style.background-color = 'yellow';
	instance.parentNode.parentNode.style.background-color = 'yellow';
	*/
	return;
}

function validatehandler(){
	var         any_regex = new RegExp('^.*$');
	var        name_regex = new RegExp('^[a-zA-Z -][a-zA-Z -]*$')
	var       email_regex = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$');
	var    sitecode_regex = new RegExp('^[0-9]{3,5}$');
	var   validindication = '<span style="color:green;">&#10004;</span>';
	var invalidindication = '&nbsp;';
	
	/* define default values */
	var indicator = null;
	var cur_regex = any_regex;
	var minlength = 0;
	
	switch( this.name )
	{
		case 'firstname':
			indicator = document.getElementById('validind_firstname');
			cur_regex = name_regex;
			minlength = 2;
			break;
		
		case 'lastname':
			indicator = document.getElementById('validind_lastname');
			cur_regex = name_regex;
			minlength = 2;
			break;
		
		case 'email':
			indicator = document.getElementById('validind_email');
			cur_regex = email_regex;
			minlength = 7
			break;
			
		case 'sitecode':
			indicator = document.getElementById('validind_sitecode');
			cur_regex = email_regex;
			minlength = 3
			break;
			
		default:
			break;
	}
	
	if ( indicator == null )
		return;
	
	if ( this.value.length >= minlength &&
		 cur_regex.test(this.value) == true )
		indicator.innerHTML = validindication;
	else
		indicator.innerHTML = invalidindication;
	
	return;
}
