/*https://music.163.com/weapi/song/enhance/player/url //mp3文件
https://music.163.com/weapi/song/lyric //歌词
https://music.163.com/weapi/v1/resource/comments/get //评论
https://music.163.com/weapi/v1/discovery/simiSong //还喜欢听的歌


params:YZDOQB4rCBrSTDdtOlkXOHwkCiDzJW1qPgBn3nzeV3YCCXMjV5G1pI6Jh97A33neWjCa4QQnVRs3hO2cMPPOXfbJNpvy/AZ/1RZEazlH9bM=
encSecKey:428701e2ac634debc0e4cb7449c05251ebf5f304ddf01566aeb5bcb6a5a9fa242a9c677b9610450d534328c3b859456ec04a51c54d78709ce4963af260f83006605665abb0bb9a839c8405cb63a8ccef2d0c6afb1a40eb929f5c06714d1162fc5b4dcedf54e9581fd720df036b76d9d27f495a75846dbe378f7553b636b3a327


params:Hw4jg6KU0cN4kAhsAV2ajQVIfUs/f9Ei+WtdQS/OZq+uQdmOgWX3ZQpEGAv6UskES7pHBC3iPiFnXq1CEqT4YoIOE452JIu9yfLzSQVODps=
encSecKey:6a9692525559fdef4c0c316a407b36685a01d103b893e819043506a005c5175e647c79ff4d40db801f386aff90e2c82395663ac325ba22871ba02672c9ef7f048975aef92723a399b5f3c01b8d88cb993c8f41f958f8d633df45da9a263295b9ff986da59496551aed97a51c4a9ba738e37f7588f2c431fa9c855a61a508b26c 
"{"ids":"[525016797]","br":128000,"csrf_token":""}"
"{"id":"545272449","c":"[{\"id\":\"545272449\"}]","csrf_token":""}"
*/

var setV = {d:"{\"ids\":\"[\\\"1294899063\\\"]\",\"br\":\"128000\"}",e:'010001',f:"00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7",g:"0CoJUm6Qyw8W8jud"}
function __n(e) {
	var t, r, n = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", i = "";
	for (t = 0; e > t; t += 1)
		r = Math.random() * n.length,
		r = Math.floor(r),
		i += n.charAt(r);
	return i
}
function __i(e, t) { //aes加密
	var r = CryptoJS.enc.Utf8.parse(t)
	, n = CryptoJS.enc.Utf8.parse("0102030405060708")
	, i = CryptoJS.enc.Utf8.parse(e)
	, o = CryptoJS.AES.encrypt(i, r, {
	iv: n,
	mode: CryptoJS.mode.CBC
	});
	return o.toString()
}
function __o(e, t, r) { //rsa加密
	//jsencrypt.js
	var n, i;
	
	return setMaxDigits(131),
	n = new RSAKeyPair(t,"",r),
	i = encryptedString(n, e)
}
//{"ids":"[\"1294899063\"]","br":"128000"}
//00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7
//010001
//0CoJUm6Qyw8W8jud
function __a(e, t, r, a) {
	var s = {}
	  , u = __n(16);
	return s.encText = __i(e, a),
	s.encText = __i(s.encText, u),
	s.encSecKey = __o(u, t, r),
	s
}
function __s(e, t, r, n) {
	var i = {};
	return i.encText = o(e + n, t, r),
	i
}
function __setCookie(){
	var cookies = "_iuqxldmzr_=32; _ntes_nnid=d34abbe36ac175e613653695a024446f,1535182652738; _ntes_nuid=d34abbe36ac175e613653695a024446f; WM_TID=02fOyLZUkn9Cx1Mk8rdGUIf5JC8MOMzU; __utma=94650624.1729429031.1535186517.1535459615.1535555297.7; __utmz=94650624.1535555297.7.7.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; WM_NI=NrXqwYZgSXniPT5Sj2uwAAmfbnmw9eTbsy%2B9KFG7djd77oeuyenG%2FIVIP7WwEI3lASHxnnKaTIYedIb3zduFfaldpjd0UVGrUtqB1E7%2FpYt4zSYNR3iTtvLCd21g0GwfaHI%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6eed5f662b39e97a9c961b28db6b7ee5c968b9795cc74b387a5a2f15bf8b38695d12af0fea7c3b92a8eae9892f6539ab99db9ed63948cfbb4e93ab7a98fa2f06ea2b2a398bc6f98bebd9aaa33899a89d8e762a8e9f990e87fbbbba2a8ae439697a0d8d67d8797fd8dc4598ca8a28fca6b98979786e743a2edb685f84ea6bfa485f362a8f09bb7c67a97acbfa3b44ff5f1c0baf740ba8d97afd139ab8cbc97cf49a8eeff88b34db5baafa9cc37e2a3; abt=10; JSESSIONID-WYYY=yZ%2F%2FTnIlU%2FEGC52vi1b06eYnhq4z4MCNjQjF%5CZ5aAsEdbr6Zj5cCmCJcyzE13%2Be%2BwcO%2BrQtlGvuJUmV7REDsba3Nmng3ICwVih8xZv9DJAO%2FI45IjIZgMwREShS94WefADq9rO0k%2B70b87pxzplAG0M%5C2vzSW4zkPf%2BNqKasDmExaSGr%3A1535703207465";
	var colist = cookies.split("; ");
	for(var i = 0; i<colist.length;i++){
		var v_a = colist[i].split("=");
		$.cookie(v_a[0],v_a[1]);
	}
}
function __addListenround(id){
	var la = $.cookie("listenround");
	if (la == undefined){
		la="";
	} else {
		la = la.replace(id+",","");
	}
	$.cookie("listenround",id+","+la);
}

function __addplayList(list){
	var cookie = "";
	for(var i = 0 ; list.length > i ;i++){
		cookie = cookie + list[i].id + ","; 
	}
	$.cookie("playList",cookie);
}
function __getplayList(){
	return $.cookie("playList");
}
function __getListenround(){
	return $.cookie("listenround");
}
function __addCur(point,id,cur){ //最后播放的位置
	$.cookie("lastCur",point+","+id+","+cur);
}
function __getlastCur(){ //最后播放的位置
	return $.cookie("lastCur");
}
function __getKeyton(){
	var res =  __a(setV.d,setV.e,setV.f,setV.g);
	return [res.encText,res.encSecKey] ;
}
function __setSet(val){
	console.error(val);
	val.forEach(function (value, key, map) {
		//$.cookie(key,value);
	})
}

function __standardLyric(lyric){
	var lyrics = lyric.lrc.lyric.split("\n");
	var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/;
	var ended = new Array();
	for(var i=0;i<lyrics.length;i++){
		var timeRegExpArr = lyrics[i].match(timeReg);
		if(!timeRegExpArr)continue;
		var clause = lyrics[i].replace(timeReg,'');
		var time = 0;
		var t = timeRegExpArr[0];
		var min = Number(String(t.match(/\[\d*/)).slice(1));
		var sec = Number(String(t.match(/\:\d*/)).slice(1));
		time = min * 60 + sec; //时间秒计
		ended[time] = clause;
	}
	return ended;
}
