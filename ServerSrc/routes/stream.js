var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('stream', { title: '' });
});


/* GET Video page. 
router.get('/', function(req, res, next) {
  res.writeHead(200,{'Content-Type':'video/mp4'});
  var rs=fs.createReadStream('EhsanQadri.mp4');
  rs.pipe(res)
});*/

module.exports = router;
