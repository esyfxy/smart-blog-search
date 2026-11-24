var JMusicjsoup = {
	getRecommends:function(callback){
		$.ajax({
			url:'/musicapi/apiqq/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
			data:{'g_tk':5381,'uin':0,'format':'json','inCharset':'utf-8','outCharset':'utf-8','notice':0,'platform':'h5','needNewCode':1,'_':1535537714744},
			dataType:'json',
			type:'get',
			async:true,
			success:function(data){
				callback._setRecommend(data);
			}
		});
	},
	getNewsongs:function(num,callback){
		//"{"limit":10}"
		setV.d = '{"limit":'+num+'}';
		var res = __getKeyton();
		$.ajax({
			url:'/mapi163/weapi/personalized/newsong',
//			data:{'params':'ujh2NED7JxtOit8f2Vo/sp+bqzzC9urfBWjZD60xDdA=','encSecKey':'302d922dd30c10cc489121d1e5e956db50d5d3f8cf1f46dae2c501d88d378cb4b4b11d732efafb3c02c8e5b4e6f2633a5422bf8a0f902a10eb1627ee3665d1dbf370de4356b9a9348f0a3ff8ffb188e996d8e2f8878a95effac07ab1295ebb81ff06127e3e58d339a07d6c824128b58d2f60b60c284b7a55b70ea5e4e126136a'},
			data:{'params':res[0],'encSecKey':res[1]},
			dataType:'json',
			type:'post',
			async:true,
			success:function(data){
				callback._setNewsongs(data);
			}
		});
	},
	// getLyric:function(id,callback){
	// 	setV.d = '{"id":"'+id+'","lv":0,"tv":0}';
	// 	var res = __getKeyton();
	// 	$.ajax({
	// 		url:'/mapi163/weapi/song/lyric',
	// 		data:{'params':res[0],'encSecKey':res[1]},
	// 		dataType:'json',
	// 		type:'post',
	// 		async:true,
	// 		success:function(data){
	// 			callback._setLyric(id,data);
	// 		}
	// 	});
	// },
	getLyric:function(id,callback){
		let params = { id };
		params.timestamp = new Date().getTime();
		$.ajax({
			url: '/api/netapi/lyric',
			method: 'get',
			data: {
			  ...params,
			},
			async:true,
			success:function(data){
				callback._setLyric(id,data);
			}
		});
	},
	getListsongs:function(callback){
		$.ajax({
			url:'/mapi163/weapi/v6/playlist/detail',
			data:{'params':'KvByhpvz7lzKJlmmur31pyP9wun0SzssbTnXHQveNOPYvGMFH7w8U+0pcbpv3NX0','encSecKey':'be25f5794f940eebbde77dba783699e38bc12db41eadee670e69ebd16a3b29277817dd1795814de4c8264a28e5383da8620736d21275cc3b1f32797c4c63ca76db5dcae60fb21cc2b5d02741ed49fef00dcdaf3e16027de3c5ede1c7d8b8c182f1b0c5fedac846a5f511dbcda94936425b7a5df71dfd54cad47120e26d974b64'},
			dataType:'json',
			type:'post',
			async:true,
			success:function(data){
				callback._setListsongs(data);
			}
		});
	},
	getKeywordsHot(){
		//https://music.163.com/weapi/search/hot
		//d = "{"type":1111}"
	},
	getKeywordsTips(key,callback){ //关键词
		setV.d = '{"s":"'+key+'"}';
		var res = __getKeyton();
		$.ajax({
			url:'/mapi163/weapi/search/suggest/keyword',
			data:{'params':res[0],'encSecKey':res[1]},
			dataType:'json',
			type:'post',
			async:true,
			success:function(data){
				if(callback!=null){
					callback._setKeywordsTips(data);
				}
			}
		});
	},
	getSearchRes(key,limit,offset,callback){
		//"{"s":"神","limit":20,"offset":20,"type":1,"strategy":5,"queryCorrect":true}" 继续获取
		setV.d = '{"s":"'+key+'","type":1,"limit":'+limit+',"offset":'+offset+',"strategy":5,"queryCorrect":true}';
		var res = __getKeyton();
		$.ajax({
			url:'/mapi163/weapi/search/get/',
			data:{'params':res[0],'encSecKey':res[1]},
			dataType:'json',
			type:'post',
			async:true,
			success:function(data){
				if(callback!=null){
					callback._setSearchRessong(data);
				}
				//data.result;//"songs"下直接取个数 songs[0].name song[0].ar[0].name
			}
		});
	},
	getSongInfo(id,callback){
		setV.d ='{"id":"'+id+'","c":"[{\\"id\\":\\"'+id+'\\"}]"}';
		var res = __getKeyton();
		$.ajax({
			url:'/mapi163/weapi/v3/song/detail',
			data:{'params':res[0],'encSecKey':res[1]},
			dataType:'json',
			type:'post',
			async:true,
			success:function(data){
				if(callback!=null){
					if(data.code==200){
						callback._setSongInfo(id,data); //songs:data.playlist.[tracks,name]
					}
					
				}
			},
			error:function(err){
				console.log(err);
			}
		});
	},

	getPlayLists(key,limit,offset,callback){
		//获得歌单内容
		//https://music.163.com/weapi/v3/playlist/detail
		//d:"{"id":"2358852380","n":1000}" 歌单ID
		//"{"s":"神","limit":20,"offset":20,"type":1,"strategy":5,"queryCorrect":true}" 继续获取
		setV.d = '{"limit":'+limit+',"offset":'+offset+',"s":"'+key+'","total":"true","type":"1000","csrf_token":""}';
		var res = __getKeyton();
		$.ajax({
			url:'/mapi163/weapi/cloudsearch/get/web',
			data:{'params':res[0],'encSecKey':res[1]},
			dataType:'json',
			type:'post',
			async:true,
			success:function(data){
				console.error(data);
				if(callback!=null){
					callback._setSearchResplay(data); //songs:data.playlist.[tracks,name]
				}
			}
		});
	},
	// getPlayList(id,callback){
	// 	//获得歌单内容
	// 	//https://music.163.com/weapi/v3/playlist/detail
	// 	//d:"{"id":"2358852380","n":1000}" 歌单ID
	// 	setV.d = `{"id":"${id}","total":"True","limit":1000,"n":1000,"csrf_token":"09556b378da338d2c373d38422f901a6"}`;
	// 	var res = __getKeyton();
	// 	$.ajax({
	// 		url:'/mapi163/weapi/v3/playlist/detail',
	// 		data:{'params':res[0],'encSecKey':res[1]},
	// 		dataType:'json',
	// 		type:'post',
	// 		async:true,
	// 		success:function(data){
	// 			if(callback!=null){
	// 				callback._setPlayList(data); //songs:data.playlist.[tracks,name]
	// 			}
	// 		}
	// 	});
	// },
	getPlayList(id,callback){
		let params = { id };
		params.timestamp = new Date().getTime();
		$.ajax({
			url: '/api/netapi/playlist/detail',
			method: 'get',
			data: {
			  ...params,
			},
			async:true,
			success:function(data){
				if(callback!=null){
					callback._setPlayList(data); //songs:data.playlist.[tracks,name]
				}
			}
		});
	},
	getuserPlayList(id,callback){
		//获得用户的所有歌单
		//https://music.163.com/weapi/v3/playlist/detail
		//d:"{"id":"2358852380","n":1000}" 歌单ID
		//"{"s":"神","limit":20,"offset":20,"type":1,"strategy":5,"queryCorrect":true}" 继续获取
		setV.d = '{\"uid\":\"'+id+'\",\"offset\":"0","limit":"1001"}';
		var res = __getKeyton();
		$.ajax({
			url:'/mapi163/weapi/user/playlist',
			data:{'params':res[0],'encSecKey':res[1]},
			dataType:'json',
			type:'post',
			async:true,
			success:function(data){
				if(callback!=null){
					callback._setuserPlayList(data); //songs:data.playlist.[tracks,name]
				}
			}
		});
	},
	getCommentsByPlayList(id,callback){
		//获得评论内容
		//https://music.163.com/weapi/v1/resource/comments/get
		//d:"{"resourceType":0,"resourceId":"2358852380","limit":15}" 歌单ID
		setV.d = '{"resourceType":0,"resourceId":"'+id+'","limit":15}';
		var res = __getKeyton();
		$.ajax({
			url:'/mapi163/weapi/v1/resource/comments/get',
			data:{'params':res[0],'encSecKey':res[1]},
			dataType:'json',
			type:'post',
			async:true,
			success:function(data){
				if(callback!=null){
					callback._setPlayList(data); //songs:data.playlist.[tracks,name]
				}
			}
		});
	},
	// getMp3Url(id,callback){
	// 	setV.d = `{"ids":"[\\"${id}\\"]","level":"lossless","encodeType":"aac","csrf_token":"","br":"128000"}`;
	// 	//setV.d = "{\"ids\":\"[\\\""+id+"\\\"]\",\"br\":\"128000\"}";
	// 	var res =  __getKeyton();
	// 	$.ajax({
	// 		url:'/mapi163/weapi/song/enhance/player/url',
	// 		type:'post',
	// 		dataType:'json',
	// 		async:true,
	// 		data:{'params':res[0],'encSecKey':res[1]},
	// 		success:function(data){
	// 			if(callback!=null){
	// 				callback._setMp3Url(id,data);
	// 			}
	// 		},
	// 		error:function(err){
				
	// 		}
	// 	});
	// },
	getMp3Url(id,callback){
		let params = { id };
		params.timestamp = new Date().getTime();
		$.ajax({
			url:'/api/netapi/song/url',
			method: 'get',
			data: {
			  ...params,
			},
			async:true,
			success:function(data){
				if(callback!=null){
					callback._setMp3Url(id,data);
				}
			},
			error:function(err){
				
			}
		});
	},
	unblockUrl(id,callback){
		let params = { id };
		params.timestamp = new Date().getTime();
		$.ajax({
			url:'/api/netapi/song/unblock',
			method: 'get',
			data: {
			  ...params,
			},
			async:true,
			success:function(data){
				if(callback!=null){
					callback._unblockUrl(id,data);
				}
			},
			error:function(err){
				
			}
		});
	},
	getOnline(callback){
		$.ajax({
			url:'/userarea',
			type:'post',
			dataType:'json',
			async:true,
			data:{"type":"ONLINE"},
			success:function(data){
				if(data.status == 0){
					if(callback!=null){
						Jsonp.getUser(data.message,callback);
					}
				}
			},
			error:function(err){
				
			}
		});
	},
	getUser(id,callback){
		$.ajax({
			url:'/userarea',
			type:'post',
			dataType:'json',
			async:true,
			data:{"type":"USER","id":id},
			success:function(data){
				if(callback!=null){
					callback._setUser(data);
				}
			},
			error:function(err){
				
			}
		});
	}
}
