/*
  This script is still experimental, still working on updating asm.js support.
*/

importScripts('../build/ffmpeg_asm.js');

var now = Date.now;

function print(text) {
  postMessage({
    'type' : 'stdout',
    'data' : text
  });
}

onmessage = function(event) {

  var message = event.data;

  if (message.type === "command") {

    var Module = {
      print: print,
      printErr: print,
      files: message.files || [],
      arguments: message.arguments || []
      // Can play around with this option - must be a power of 2
      // TOTAL_MEMORY: 268435456
    };

    postMessage({
      'type' : 'start',
      'data' : Module.arguments.join(" ")
    });

    postMessage({
      'type' : 'stdout',
      'data' : 'Received command: ' + Module.arguments.join(" ")
    });

    var time = now();
    var result = ffmpeg_run(Module);

    var totalTime = now() - time;
    postMessage({
      'type' : 'stdout',
      'data' : 'Finished processing (took ' + totalTime + 'ms)'
    });

    postMessage({
      'type' : 'done',
      'data' : result,
      'time' : totalTime
    });
  }
};

postMessage({
  'type' : 'ready'
});
