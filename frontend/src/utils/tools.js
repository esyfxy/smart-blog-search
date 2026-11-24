


export const isMobile = function(){
	var ua = navigator.userAgent;
	var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
	isIphone = /(mobile|mobi|wap|iphone)/i.test(ua),
	isAndroid = ua.match(/(Android)\s+([\d.]+)/),
	isMobile = isIphone || isAndroid;
	if(isMobile) {
		return true;
	}else{
		return false;
	}
}
export const navigation = function(selector) {
	let pageId = document.querySelector(selector);
	window.scrollTo({
	  top: pageId.offsetTop,
	  behavior: "smooth"
	});
}
export const formatDate = function(date) {
	var date = new Date(date);
	var YY = date.getFullYear() + '-';
	var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
	var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
	var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
	return YY + MM + DD +" "+hh + mm + ss;
}
export const dataURItoBlob = function(dataURI) {//图片转成Buffer
	var byteString = atob(dataURI.split(',')[1]);
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ab], {type: mimeString});
}
