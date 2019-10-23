const winston = require('winston');
const fs = require('fs');
require('winston-mongodb');
require('winston-daily-rotate-file');

let logDirectory = '../../server_logs'


//create directory if it is not present
if (!fs.existsSync(logDirectory)) {
    // Create the directory if it does not exist
    fs.mkdirSync(logDirectory);
}

let options = {
    file: {
        level: process.env.ENV === 'development' ? 'debug' : 'info',
        filename: logDirectory + '/%DATE%-logsDemo.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        timestamp: true,
        handleExceptions: true,
        humanReadableUnhandledException: true,
        prettyPrint: true,
        json: true,
        maxsize: 5242880, // 5MB
        colorize: true,
    },
    database: {
        db: global.gConfig.database,
        collection: 'coj_logs' ,
        level: process.env.ENV === 'development' ? 'debug' : 'info',
    }
};

module.exports.logger = new winston.createLogger({
    transports: [
        new winston.transports.MongoDB(options.database),
        new winston.transports.DailyRotateFile(options.file)
    ],
    exceptionHandlers: [
        //new winston.transports.MongoDB(options.database),
        new winston.transports.DailyRotateFile(options.file)
    ],
    exitOnError: false
});

new transports.DailyRotateFile()