function restrict(elem){ //runs for checking the email id and username
	var tf = _(elem);
	var rx = new RegExp;
	if(elem == "email"){
		rx = /[' "]/g; // no ' or "
	} else if(elem == "fname" || elem == "lname"){
		rx = /[^a-z]/gi; //username only accepts alphabets , and its not case sensitive (global means works throughot the string)
	}
	tf.value = tf.value.replace(rx, "");
}