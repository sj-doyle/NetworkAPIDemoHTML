
function MakeOpenIDRequest(uri, statusfield, return_to, realm) {
    jQuery.ajax({
        async: true,
        cache: false,
        data: {
            "openid.ns" : "http://specs.openid.net/auth/2.0",
            "openid.mode" : "associate",
            "openid.assoc_type" : "HMAC-SHA256",
            "openid.session_type" : "no-encryption"
        },
        success: function(data, status, jqXHR) {
            var rl=data.split('\n');
            for (var key in rl) {
                var kv=rl[key].split(':');
                if (kv[0]=='assoc_handle') {
				    if (statusfield) {
					    jQuery('#'+statusfield).val('Association formed. Handle '+kv[1]);
				    }
				    MakeOpenIDCheckID(uri, statusfield, kv[1], return_to, realm); 
                }
            }
        },
        type: 'POST',
        dataType: 'text',
        url: uri
    });
}

function MakeOpenIDCheckID(uri, statusfield, assoc_handle, return_to, realm) {
	var requestData = 
		{'openid.assoc_handle':assoc_handle,
		'openid.ns':'http://specs.openid.net/auth/2.0',
		'openid.mode':'checkid_setup',
		'openid.claimed_id':'http://specs.openid.net/auth/2.0/identifier_select',
		'openid.identity':'http://specs.openid.net/auth/2.0/identifier_select',
		'openid.realm':realm,
		'openid.return_to':return_to,
		'openid.ns.ui':'http://specs.openid.net/extensions/ui/1.0',
		'openid.ui.mode':'x-mobile',
		'openid.ns.ax':'http://openid.net/srv/ax/1.0',
		'openid.ax.mode':'fetch_response',
		'openid.ax.required':'email,firstname,lastname',
		'openid.ax.if_available':'country,language',
		'openid.ax.type.country':'http://openid.net/schema/contact/country/home',
		'openid.ax.type.email':'http://openid.net/schema/contact/internet/email',
		'openid.ax.type.firstname':'http://openid.net/schema/namePerson/first',
		'openid.ax.type.lastname':'http://openid.net/schema/namePerson/last',
		'openid.ax.type.language':'http://openid.net/schema/language/pref'
		};

	var first=true;
	var location=uri+'?';
	jQuery.each(requestData, function(key,value) {
		if (first) {
			first=false;
		} else {
			location=location+'&';
		}
		location=location+encodeURIComponent(key)+'='+encodeURIComponent(value);
	});
	if (statusfield) {
        jQuery('#'+statusfield).val('Opening '+location);
    }
    window.location=location;
}

