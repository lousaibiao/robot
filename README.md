# robot
一个用来查找商品过往优惠价格的小程序

#使用介绍
本程序依赖于NodeJS，使用前请务必安装好NodeJS；  

#文档介绍
### index.js
默认执行文件，主要作用是建立一个http服务。

### handle.js
所有的功能函数都集中在这个文件中，包括读取html内容，获取搜索结果，输出搜索结果。

### index.html
这是一个完整的html静态页面，里面的内容可以被读取并输出到前端。

#start

`npm install`   

`node index.js`

打开浏览器，访问 http://127.0.0.1:8888
