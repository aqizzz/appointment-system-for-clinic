const winston = require('winston');
const fs = require('fs');

const env = 'DEV';
var tsFormat = () =>(new Date()).toLocaleDateString();

 if(!fs.existsSync('NodeJs')){

    fs.mkdirSync('NodeJs'); //both params are the name of the folder where we verify f the file exists.
 }

const level = env.log_level || "verbose";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  verbose: "cyan",
  debug: "blue",
  silly: "magenta"
};

winston.config.addColors(colors);

const logger = winston.createLogger({
    level: 'info',
    levels: levels,
    format: winston.format.combine(
      winston.format.colorize(), 
      winston.format.simple() 
  ),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });
  /*
const logger = winston.createLogger({
    
    transport:[
        //new winston.transports.Console(),
        new winston.transports.File({
            level:'info',
            format:winston.format.json(),
            colorize:true,
            timestamp:tsFormat,
            filename:'error.log'
        }),
        new winston.transports.File({
            name:'error-file',
            filename:'./error.log',
            level:'error',
            json:false
        })
    ],
});*/               

module.exports = logger;
module.exports.stream = {
    write:function(message,encoding){
        logger.info(message);
    }
};
