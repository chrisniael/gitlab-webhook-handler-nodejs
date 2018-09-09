var http = require('http')
var spawn = require('child_process').spawn;
var createHandler = require('gitlab-webhook-handler')
var handler = createHandler({ path: '/webhook' })

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(7777)

console.log("Gitlab Hook Server running at http://0.0.0.0:7777/webhook");

handler.on('error', function (err) {
    console.error('Error:', err.message)
})

handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
  event.payload.repository.name,
  event.payload.ref)
  runCommand('sh', ['./auto-build.sh'], function(txt) {
    console.log(txt);
  });
})

handler.on('issues', function (event) {
    console.log('Received an issue event for %s action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})

function runCommand(cmd, args, callback) {
  var child = spawn(cmd, args);
  var response = '';
  child.stdout.on('data', function(buffer) {
    response += buffer.toString();
  });
  child.stdout.on('end', function() {
     callback(response);
  });
}
