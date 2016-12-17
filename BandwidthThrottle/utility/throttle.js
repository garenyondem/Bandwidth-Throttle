var Throttle = require('throttle'),
    fs = require('fs'),
    request = require('request'),
    cuid = require('cuid'),
    log = require('./log'),
    consoleLog = new log.console();

function getFileName(link) {
    var fileName = link.split('/');
    fileName = fileName[fileName.length - 1].split('?');
    return fileName[0];
}

function removeCorruptedFile(dest, callback) {
    try {
        fs.unlink(dest, callback);
    }
    catch (err) {
        callback();
    }
}

function download(limit, link, dest, reportInterval, callback) {
    var throttle = new Throttle(limit),
        fileName = getFileName(link),
        transferredSize = 0,
        totalSize = 0,
        dest = dest + fileName,
        id = cuid();

    global[id] = setInterval(() => {
        consoleLog.info(Number((transferredSize * 100) / totalSize).toFixed(2) + '%');
    }, reportInterval);

    request(link)
        .on('error', (err) => {
            clearInterval(global[id]);
            removeCorruptedFile(dest);
            callback(err);
        })
        .on('response', (resp) => {
            if (totalSize == 0) totalSize = parseInt(resp.headers['content-length']);

            resp.on('data', (data) => {
                transferredSize += parseInt(data.length);
            });
        })
        .on('end', () => {
            clearInterval(global[id]);
        })
        .pipe(throttle)
        .pipe(fs.createWriteStream(dest).on('close', callback));
}

module.exports = {
    download: download
}