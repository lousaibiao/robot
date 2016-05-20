var fs = require("fs"),
		querystring = require("querystring"),
		cheerio = require("cheerio"),
		http = require('http');

function handle(response, postData){
	//判断是否有数据提交
	if(!postData){
		fs.readFile("./index.html",function(err, data) {
			if (err) return console.error(err);
			var htmlCon = data.toString(); 
			writeHtml(response, htmlCon);
		});
	}else{
		var keyword = querystring.parse(postData).text;
		var path = "http://search.smzdm.com/?c=faxian&s=" + keyword;
		var html = "";

		//获取搜索结果数据
		http.get(path, function(res) {
			res.on('data', function(data){
				html += data;
			});
			res.on('end', function(){
				$ =  cheerio.load(html);
				var items = $('.list-title');
				var itemhtml = [];

				//将获取到的搜索数据写入数组
				items.each(function(index, item) {
					var price = $(item).find('.list-title-price').text(); 
					var title = $(item).find('a').attr('title');
					var href = $(item).find('a').attr('href');
					var mall = $(item).parents('.search-list-right').find('.list-mall').text();
					var mallLink = $(item).parents('.search-list-right').find('.list-link').attr('href');
					var time = $(item).parents('.search-list-right').find('.list-time').text();
					itemhtml[index] = {
						price:price,
						title:title,
						href:href,
						mallLink:mallLink,
						mall:mall,
						time:time
					};
				});

				//是否查询到商品数据
				if(itemhtml.length!=0){ 
					var formData = "";

					//遍历数组，并生成html
					for(var i=0; i<itemhtml.length; i++){
						formData += '<tr><td><a target="_blank" href="'+itemhtml[i].href+'">'+itemhtml[i].title+'</a></td><td>'+itemhtml[i].price+'</td><td>'+itemhtml[i].time+'</td><td><a target="_blank" href="'+itemhtml[i].mallLink+'">'+itemhtml[i].mall+'</a></td></tr>';
					}

					//将生成的html写入到页面
					fs.readFile("./index.html",function(err, data) {
						if (err) return console.error(err);
						var htmlCon = data.toString(); 
						ch = cheerio.load(htmlCon);
						ch("table").append(formData);
						ch("input").val(keyword);
						var newHtml = ch.html();
						writeHtml(response, newHtml);
					});
				}else{

					//未查询到上品信息
					fs.readFile("./index.html",function(err, data) {
						if (err) return console.error(err);
						var htmlCon = data.toString(); 
						ch = cheerio.load(htmlCon);
						ch("table").replaceWith('<h3>找不到该商品，请换一个关键词试试</h3>');
						var newHtml = ch.html();
						writeHtml(response, newHtml);
					});
				}
			})
		}).on('error', function(error) {
			cosole.log('错误：' + error.message);
		})
	}
}

//输出到页面
function writeHtml(response, htmlCon){
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(htmlCon);
	response.end();
}

exports.handle = handle;