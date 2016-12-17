var throttle = require('./utility/throttle'),
    log = require('./utility/log'),
    consoleLog = new log.console();

const destination = __dirname + '/temp/';
const videoLink = 'http://istr.izlesene.com/data/videos/9645/9645256-480_3-170k.mp4?token=r87X3Ltkf_Gck4AVwcg1HA&ts=1482071796';
const fileLink = 'http://download2.dvdloc8.com/trailers/divxdigest/bourne_ultimatum_trailer.zip';
const imageLink = 'http://www.w3schools.com/css/trolltunga.jpg';

function options(bps, chunkSize, highWaterMark) {
    return {
        bps: bps,
        chunkSize: chunkSize,
        highWaterMark: highWaterMark
    }
}
// 1 Mbit == 0.125 Mbyte == 125 000 byte
// limit or options
throttle.download(125000 * 5, videoLink, destination, 3000, function (err) {
    if (!err) {
        consoleLog.success('Download complete');
    } else {
        consoleLog.error(err);
    }
});