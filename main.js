const os=require('os'); 
const fs = require('fs')
const path = require('path')
const url = require('url');
const http = require('http');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

var stdin = process.openStdin();
var hostname = os.hostname();
var curDir = process.cwd();
var prompt = "$";

stdin.addListener("data", function(d) {
	//User entered data
	var data=d.toString().trim();
	var cmd=data.split(" ");
	if(cmd[0]=="exit"||cmd[0]=="quit"){
		process.exit(0);
	}else if(cmd[0]=="cd"){
		if(cmd[1]){
			try{
				process.chdir(cmd[1]);
				curDir = process.cwd();
			}catch(err){
				process.stdout.write(hostname+":"+curDir+":"+prompt+err+"\n");
			}
		}
		process.stdout.write(hostname+":"+curDir+":"+prompt);
	}else if(cmd[0]=="ls"||cmd[0]=="dir"){
		
		fs.readdir(curDir, (err, files) => {
			files.forEach(file => {							
				process.stdout.write(hostname+":"+curDir+":"+prompt+file+"\n");				
			});
			
			//Command prompt
			process.stdout.write(hostname+":"+curDir+":"+prompt);
		});		
		
		
	}else if(cmd[0]=="cat"){
		if(cmd[1]){
			fs.readFile(cmd[1], function(err, contents) {
				if(!err){				
					console.log(""+contents);
					//Command prompt
					process.stdout.write(hostname+":"+curDir+":"+prompt)
				}else{
					process.stdout.write(hostname+":"+curDir+":"+prompt+err+"\n");
					//Command prompt
					process.stdout.write(hostname+":"+curDir+":"+prompt)
				}
			});		
		}else{
			process.stdout.write(hostname+":"+curDir+":"+prompt+"File not given\n");
			//Command prompt
			process.stdout.write(hostname+":"+curDir+":"+prompt)
		}
	}else if(cmd[0]=="rm"){
		if(cmd[1]){
			fs.stat(cmd[1], function (err, stats) {
				
				if (err) {
					process.stdout.write(hostname+":"+curDir+":"+prompt+err+"\n");
					//Command prompt
					process.stdout.write(hostname+":"+curDir+":"+prompt)
				}

				fs.unlink(cmd[1],function(err){
					if (err) {
						process.stdout.write(hostname+":"+curDir+":"+prompt+err+"\n");
						//Command prompt
						process.stdout.write(hostname+":"+curDir+":"+prompt)
					}else{
						process.stdout.write(hostname+":"+curDir+":"+prompt+"File Deleted.\n");
						//Command prompt
						process.stdout.write(hostname+":"+curDir+":"+prompt)
					}
			   });  
			});
			
		}
		
		
	}else if(cmd[0]=="stat"){
		if(cmd[1]){
			fs.stat(cmd[1], function (err, stats) {
				
				if (err) {
					process.stdout.write(hostname+":"+curDir+":"+prompt+err+"\n");
					//Command prompt
					process.stdout.write(hostname+":"+curDir+":"+prompt)
				}else{
								
					process.stdout.write(hostname+":"+curDir+":"+prompt+'    size: ' + stats["size"]+"\n");
					process.stdout.write(hostname+":"+curDir+":"+prompt+'    mode: ' + stats["mode"]+"\n");
					process.stdout.write(hostname+":"+curDir+":"+prompt+'    others eXecute: ' + (stats["mode"] & 1 ? 'x' : '-')+"\n");
					process.stdout.write(hostname+":"+curDir+":"+prompt+'    others Write:   ' + (stats["mode"] & 2 ? 'w' : '-')+"\n");
					process.stdout.write(hostname+":"+curDir+":"+prompt+'    others Read:    ' + (stats["mode"] & 4 ? 'r' : '-')+"\n");
				 
					process.stdout.write(hostname+":"+curDir+":"+prompt+'    group eXecute:  ' + (stats["mode"] & 10 ? 'x' : '-')+"\n");
					process.stdout.write(hostname+":"+curDir+":"+prompt+'    group Write:    ' + (stats["mode"] & 20 ? 'w' : '-')+"\n");
					process.stdout.write(hostname+":"+curDir+":"+prompt+'    group Read:     ' + (stats["mode"] & 40 ? 'r' : '-')+"\n");
				 
					process.stdout.write(hostname+":"+curDir+":"+prompt+'    owner eXecute:  ' + (stats["mode"] & 100 ? 'x' : '-')+"\n");
					process.stdout.write(hostname+":"+curDir+":"+prompt+'    owner Write:    ' + (stats["mode"] & 200 ? 'w' : '-')+"\n");
					process.stdout.write(hostname+":"+curDir+":"+prompt+'    owner Read:     ' + (stats["mode"] & 400 ? 'r' : '-')+"\n");
				 
				 
					process.stdout.write(hostname+":"+curDir+":"+prompt+'    file:           ' + (stats["mode"] & 0100000 ? 'f' : '-')+"\n");
					process.stdout.write(hostname+":"+curDir+":"+prompt+'    directory:      ' + (stats["mode"] & 0040000 ? 'd' : '-')+"\n");				
				}
			});
			
		}
		//Command prompt
		process.stdout.write(hostname+":"+curDir+":"+prompt)
	}else if(cmd[0]=="download"){
		if(cmd[1]&&cmd[2]){		
			try{
				
				//file to save the file
				var file = fs.createWriteStream(cmd[2]);
				http.get(cmd[1], function(res) {
					res.pipe(file);
					// After the response is completed,calls this function
					res.on('end', function() {
						process.stdout.write(hostname+":"+curDir+":"+prompt+"Downloading Completed.\n");
						//Command prompt
						process.stdout.write(hostname+":"+curDir+":"+prompt)
					});
				})
			}catch(err){
				process.stdout.write(hostname+":"+curDir+":"+prompt+err+"\n");
				//Command prompt
				process.stdout.write(hostname+":"+curDir+":"+prompt)
			}
			
		}else{
			process.stdout.write(hostname+":"+curDir+":"+prompt+"Invalid Parameters\n");
			//Command prompt
			process.stdout.write(hostname+":"+curDir+":"+prompt)
		}
	}else if(cmd[0]=="prompt"){
		if(cmd[1]){
			prompt =cmd[1];
			//Command prompt
			process.stdout.write(hostname+":"+curDir+":"+prompt)
		}else{
			process.stdout.write(hostname+":"+curDir+":"+prompt+"Invalid Parameters\n");
			//Command prompt
			process.stdout.write(hostname+":"+curDir+":"+prompt)
		}
	}else{
		console.log("Invalid Choice");
	}
	
});
  

  
console.log("Command Line Application");
//Command prompt
process.stdout.write(hostname+":"+curDir+":"+prompt);
