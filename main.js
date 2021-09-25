function encrypt(s,k) {
	var sencrypted ='';
	var slength =s.length;
	var klength=k.length;
	for (i=0;i<slength;i++) 
	{
		var code =s.charCodeAt(i);
		code=code^(k.charCodeAt(i%klength));
		var chaineHexa = code.toString(16);
		var x = parseInt(255/16)*16+chaineHexa.length;
		var random = x.toString(16);
		if(random.length==1)
			random = '0'+random;
		chaineHexa= random+chaineHexa;
		sencrypted+=chaineHexa;
	}
	return sencrypted;
	}
function decrypt(s,k) {
		var decrypted = '';
		var klength = k.length;
		var h = "";
		var len = s.length;
		var a = 0;
		var j = 0;
		var o = 0;
		while(o<len) 
		{	
			var slen ="";
			slen = s[o]+s[o+1];
			var nlen = parseInt(slen,16)%16;
			h=s.substr(o+2,nlen);
			a=parseInt(h,16);
			a=a^(k.charCodeAt(j%klength));
			decrypted+=String.fromCharCode(a);
			o=o+nlen+2; 
			j++;
		}	
		return decrypted;
	}
function base64_decode( data ) {
	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var o1, o2, o3, h1, h2, h3, h4, bits, i=0, enc='';
	do {
		h1 = b64.indexOf(data.charAt(i++));
		h2 = b64.indexOf(data.charAt(i++));
		h3 = b64.indexOf(data.charAt(i++));
		h4 = b64.indexOf(data.charAt(i++));
		bits = h1<<18 | h2<<12 | h3<<6 | h4;
		o1 = bits>>16 & 0xff;
		o2 = bits>>8 & 0xff;
		o3 = bits & 0xff;
		if (h3 == 64)	  enc += String.fromCharCode(o1);
		else if (h4 == 64) enc += String.fromCharCode(o1, o2);
		else			   enc += String.fromCharCode(o1, o2, o3);
	} while (i < data.length);
	return enc;
}
function base64_encode( data ) {
	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var o1, o2, o3, h1, h2, h3, h4, bits, i=0, enc='';
	do {
		o1 = data.charCodeAt(i++);
		o2 = data.charCodeAt(i++);
		o3 = data.charCodeAt(i++);
		bits = o1<<16 | o2<<8 | o3;
		h1 = bits>>18 & 0x3f;
		h2 = bits>>12 & 0x3f;
		h3 = bits>>6 & 0x3f;
		h4 = bits & 0x3f;
		enc += b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	} while (i < data.length);
	switch( data.length % 3 ){
		case 1:
			enc = enc.slice(0, -2) + '==';
		break;
		case 2:
			enc = enc.slice(0, -1) + '=';
		break;
	}
	return enc;
}
function handleBackspaces(s) {
    var len;
    do {
        len = s.length;
        s = s.replace(/[^\x08]\x08/, '');
    } while (s.length != len);

    return s;
}
String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("0"+hex).slice(-2);
    }

    return result
}
String.prototype.hexDecode = function(){
    var j;
    var hexes = this.match(/.{1,2}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}

function setText(txt) {
    txt = handleBackspaces(txt);
	$('textarea[name=message]').val(txt);
}

$(function() {
if(!localStorage.getItem("chat.black.user")) {
	var strs = base64_encode(encrypt(""+Math.floor((Math.random()*320)^435)+Math.floor((Math.random()*230)^435)+"","a1b2c3d4e5f6g7h8t9y0x"));
	localStorage.setItem("chat.black.user",strs.hexEncode());
}
$( "#exit" ).click(function(){
	localStorage.removeItem("chat.black.user");// Uncomment for cleaning User ID
	localStorage.removeItem("chat.black.nick");// Uncomment for cleaning User ID
});
$( "#formenc" ).submit(function( event ) {
  if ( $( "#enc" ).val()) {
	  var text = $('#enc').val(); 
	  if($('#passenc').val()){
	  var passenc= $('#passenc').val(); 
      $('#passdec').val($('#passenc').val());
      }	else {
	  var passenc= 'Vm0weE1GbFhTWGxWV0doVVltdHdUMVpzV25kVU1WcDBaVWRHV0ZKc2NIbFdNakZIVmxVeFdHVkdiR0ZXVjJoTVdXdGFTMk14VG5OalJtaFlVMFZLTmxac1dtRldNVnBXVFZWV2FHVnFRVGs9'; 
	  }
	var sd = base64_encode(encrypt(text,passenc)); 
	var sd = sd.hexEncode();
	if(sd.length < 4000){
	$('#strlen').text(sd.length+"/4000");
	} else {
	$('#strlen').html("<span style='color:#CFD8DC;'>Ошибка, сообщение не поместиться в одно</span> "+sd.length+"/4000");
	}
	$('#dec').val(sd);
		setText(sd);

  }
  event.preventDefault();
});
$( "#formdec" ).submit(function( event ) {
  if ( $( "#dec" ).val()) {
	  var text = $('#dec').val();
	 if($('#passdec').val()){
	  var passdec= $('#passdec').val(); 
      $('#passenc').val($('#passdec').val());
      }	else {
	  var passdec= 'Vm0weE1GbFhTWGxWV0doVVltdHdUMVpzV25kVU1WcDBaVWRHV0ZKc2NIbFdNakZIVmxVeFdHVkdiR0ZXVjJoTVdXdGFTMk14VG5OalJtaFlVMFZLTmxac1dtRldNVnBXVFZWV2FHVnFRVGs9'; 
	  }
	var sd = decrypt(base64_decode(text.hexDecode()),passdec); 
	if(sd.length < 4000){
	$('#strlen').text(sd.length+"/4000");
	} else {
	$('#strlen').html("<span style='color:#CFD8DC;'>Ошибка, сообщение не поместиться в одно</span> "+sd.length+"/4000");
	}
			$('#enc').val(sd);
		setText(sd);
  }
  event.preventDefault();
});
$( "#dec" ).focus(function (e) {
	$( "#formdec" ).submit();
});
$( "#dec" ).keypress(function (e) {
	$( "#formdec" ).submit();
});
$( "#enc" ).keypress(function (e) {
	$( "#formenc" ).submit();
});
$( "#enc" ).focus(function (e) {
	$( "#formenc" ).submit();
});
$( "#ds" ).click(function() {
	  $("*").css( { backgroundColor : "#1a1a1a" } );
	  $("textarea, input").css( { backgroundColor : "#666666" } );
	  $("*").addClass('colorset');
});
});
