import http from  './request';

// 单独导出的函数
export const getShowByIds = function (data, callback) {
	$.ajax({
		url: `/ablaze/get/works/ids/${data.point}`,
		type: "get",
		data: data,
		async: true,
		success: function (data) {
			callback(data);
		}
	});
}

export const getShow = function (data, callback) {
	$.ajax({
		url: '/ablaze/get/works/'+data.point,
		type: "get",
		data: data,
		async: true,
		success: function (data) {
			callback(data);
		}
	});
}

export const getComments = function (data, callback){
	$.ajax({
		url : `/ablaze/get/comments/${data.type}/${data.wid}/${data.fid}/${data.start}/${data.num}`,
		type : "get",
		async : true,
		success : function(data) {
			callback(data);

		}
	});
}
export const addComment = function(data, callback){
	$.ajax({
		url : `/ablaze/insert/comment`,
		type : "post",
		headers: {
			Authorization:  window.localStorage.getItem("token")
		},
		data:data,
		async : true,
		success : function(data) {
			callback(data);

		}
	});
}
export const getWork = function(data, callback){
	$.ajax({
		url : `/ablaze/get/work/${data.point}/${data.id}`,
		type : "get",
		data:data,
		async : true,
		success : function(data) {
			callback(data);
		}
	});
}
/**
 * 
 * @param {*} data 
 * @param {*} callback 
 */
export const actWork = function(data, callback){
	$.ajax({
		url : `/ablaze/act/work/${data.point}/${data.wid}/${data.act}`,
		type : "post",
		headers: {
			Authorization:  window.localStorage.getItem("token")
		},
		async : true,
		success : function(data) {
			callback(data);

		}
	});
	
}
/**
 * 
 * @param {point,start,num,keys} data 
 * @param {*} callback 
 */
export const searchWork = function(data, callback){
	$.ajax({
		url : `/ablaze/search/works/${data.point}`,
		type : "get",
		data:data,
		async : true,
		success : function(data) {
			callback(data);

		}
	});
}
export const getHotKeys = function(data, callback){
	$.ajax({
		url : `/ablaze/get/keywords/${data.start}/${data.num}/${data.key}`,
		type : "get",
		async : true,
		success : function(data) {
			callback(data);

		}
	});
}
export const getUser = function(data,callback){
	$.ajax({
		url:`/ablaze/get/user/${data.id}`,
		type:"get",
		async: true,
		success: function (data) {
			callback(data);
		}
	})
}

// 获取当前用户信息
export const getCurrentUserInfo = () => http.get('/user/info');
export const setUserPassword = function(data,callback){
	$.ajax({
		url : `/ablaze/set/userpassword`,
		type : "post",
		headers: {
			Authorization:  window.localStorage.getItem("token")
		},
		data:data,
		async : true,
		success : function(data) {
			callback(data);
		}
	});
}
export const updateUser = function(data,callback){
	$.ajax({
		url : `/ablaze/set/user`,
		type : "post",
		headers: {
			Authorization:  window.localStorage.getItem("token")
		},
		data:data,
		async : true,
		success : function(data) {
			callback(data);
		}
	});
}
export const updateUserSafe = function(data,callback){
	$.ajax({
		url : `/ablaze/set/safe/user`,
		type : "post",
		headers: {
			Authorization:  window.localStorage.getItem("token")
		},
		data:data,
		async : true,
		success : function(data) {
			callback(data);
		}
	});
}
export const followUser = function(data,callback){
	$.ajax({
		url:`/ablaze/act/user/${data.tid}/${data.act}`,
		type:"post",
		headers: {
			Authorization:  window.localStorage.getItem("token")
		},
		async: true,
		success: function (data) {
			callback(data);
		}
	})
}
export let bangu_getCollection = function(data, callback) {
	// 构建查询参数
	const params = new URLSearchParams();
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			params.append(key, data[key]);
		}
	}
	
	// 构建完整URL
	const apiUrl = `/scrape?url=${encodeURIComponent("https://api.bgm.tv/v0/users/607071/collections?" + params.toString())}`;
	
	// 使用http (axios实例) 代替$.ajax
	http.get(apiUrl)
		.then(response => {
			callback(response);
		})
		.catch(error => {
			console.error("请求失败:", error);
			callback({
				code: 500,
				message: "请求失败，请稍后重试",
				data: []
			});
		});
}

export let bangu_getCollections = function(data, callback) {
	// 构建完整URL
	const apiUrl = `/ablaze/gethtml?url=${encodeURIComponent("https://api.bgm.tv/user/607071/collections/" + data.type + "?app_id=bgm191760e15e1785468")}`;
	
	// 使用http (axios实例) 代替$.ajax
	http.get(apiUrl)
		.then(response => {
			callback(response);
		})
		.catch(error => {
			console.error("请求失败:", error);
			callback({
				code: 500,
				message: "请求失败，请稍后重试",
				data: []
			});
		});
}

export let getAlistContent = function (data) {
	return http.get(`/alist/fs/list`,data)
}

export let getValue = function (data) {
	return http.get(`/kv/key-value/query`,data)
}

export let setValue = function (data) {
	return http.post(`/kv/key-value`,data)
}

/**
 * 创建一个订单
 *
 * @param {Object} data - JSON对象，包含以下字段：
 *  - productDescription {string} - 商品描述
 *  - amount {number} - 价格
 *  - userId {string} - 用户标识
 *  - productCode {string} - 产品标识
 * @returns {Promise} - HTTP POST请求的Promise对象
 */
export let createOrder = function(data) {
	return http.post(`/trade/order/createOrder`,data)
}
/**
 * 查询订单状态
 *
 * @param {data}  
 *  - orderId {string} 订单ID
 * @returns {Promise} - HTTP GET请求的Promise对象
 */
export let queryOrderStatus = function(data) {
	return http.get(`/trade/order/query`, data)
}


export let searchMusic = function(data = {key : '' ,type: 1}) {
	return http.get(`/netapi/search?keywords=${data.key}&type=${ data.type || 1 }&limit=${data.limit || 5}&offset=${data.offset || 0}`)
}

export let searchPlaylist = function(data = {key : ''}) {
	return http.get(`/netapi/search?keywords=${data.key}&type=1&limit=${data.limit || 5}&offset=${data.offset || 0}`,data)
}

// 修改后的 getPlayList 函数
export let getPlayList = function(id) {
	let params = { id };
	params.timestamp = new Date().getTime();
	return http.get('/netapi/playlist/detail', params);
};

// 添加默认导出，整合所有API函数
const api = {
	getShowByIds,
	getShow,
	getComments,
	addComment,
	getWork,
	actWork,
	searchWork,
	getHotKeys,
	getUser,
	getCurrentUserInfo,
	setUserPassword,
	updateUser,
	updateUserSafe,
	followUser,
	bangu_getCollection,
	bangu_getCollections,
	getAlistContent,
	getValue,
	setValue,
	createOrder,
	queryOrderStatus,
	searchMusic,
	searchPlaylist,
	getPlayList
};
export default api;
