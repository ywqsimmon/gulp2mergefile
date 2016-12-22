var gulp = require('gulp');
var del = require('del');
var through = require('through2');
var http = require('http');

gulp.task('clean',function(cb){
	del.sync(['build']);
	cb();
});

gulp.task('default',['clean'],function(){
	return gulp.src(['./src/origin.js'])
	.pipe(through.obj(function(file,enc,cb){
		var that = this;
		fetch({
			hostname: 'g.alicdn.com',
			port: '80',
			path: '/kissy/k/1.4.16/seed-min.js',
			method: 'get',
		},function(buf){
			file.contents = Buffer.concat([file.contents,buf]);
			that.push(file);
			cb();
		});
	}))
	.pipe(gulp.dest('build'));
});

function fetch(opt,callback){
	var req = http.request(opt,function(res){
		var buf = [];
		res.on('data',function(chunk){
			buf.push(chunk);
		});
		res.on('end',function(){
			callback(Buffer.concat(buf));
		});
	});
	req.on('error',function(e){
		console.log(e);
	})
	req.end();
}