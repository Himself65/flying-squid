module.exports.player=function(player) {

  player.commands.add({
    base: 'help',
    info: 'to show all commands',
    usage: '/help [command]',
    action(params) {
      var c = params[0];
      var hash = player.commands.hash;

      if(c) {
        var res = player.commands.find(params[0])[0];

        var help = res.params.help && res.params.help(params);
        return help ? '' + help : 'Information not found';
      } else {
        var used = [];
        for(var key in hash) {
          if(used.indexOf(hash[key]) > -1) continue;
          used.push(hash[key]);

          if(hash[key].params.info) {
            var str = hash[key].params.usage + ' ' + hash[key].params.info;
            if(hash[key].params.aliases && hash[key].params.aliases.length) {
              str += ' (aliases: ' + hash[key].params.aliases.join(', ') + ')';
            }

            player.chat(str);
          }
        }
      }
    }
  });

  player.commands.add({
    base: 'ping',
    info: 'to pong!',
    usage: '/ping [number]',
    action(params) {
      var num = params[0] * 1 + 1;

      var str = 'pong';
      if(!isNaN(num)) str += ' [' + num + ']';

      player.chat(str + '!');
    }
  });

  player.commands.add({
    base: 'modpe',
    info: 'for modpe commands',
    usage: '/modpe <params>',
    parse(str) { return str ? str : false },
    action(str) {
      player.emit("modpe", str);
    }
  });

  player.commands.add({
    base: 'version',
    info: 'to get version of the server',
    usage: '/version',
    action() {
      return 'This server is running flying-squid version 0.1.0';
    }
  });

  player.commands.add({
    base: 'bug',
    info: 'to bug report',
    usage: '/bug',
    action() {
      return 'Report bugs / issues here: https://github.com/mhsjlw/flying-squid/issues';
    }
  });


  player.handleCommand = (str) => {
    var res = player.commands.use(str);
    if(res) player.chat('' + res);
  };
};
