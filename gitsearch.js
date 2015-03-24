#!/usr/bin/env node
var
    program = require('commander'),
    request = require('request'),
    chalk = require('chalk'),
    keywords,
    url = '';

program
    .version('0.0.1')
    .usage('[options] <keywords>')
    .option('-o, --owner [name]', 'Filter by the repositories owner')
    .option('-l, --language [language]', 'Filter by the repositories language')
    .parse(process.argv);

if (!program.args.length) {
    program.help();
}

else {
    keywords = program.args;
    url = 'https://api.github.com/search/repositories?sort=stars&order=desc&q=' + keywords;
    
    if (program.owner) {
        url = url + '+user:' + program.owner;
    }

    if (program.language) {
        url = url + '+language:' + program.language;
    }
    
    request({
        method: 'GET',
        headers: {
            'User-Agent': 'th3mon'
        },
        url: url
    }, function(error, response, body) {
        var i = 0;
        
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
        
            for (; i < body.items.length; i += 1) {
                console.log(chalk.cyan.bold.underline('Name: ' + body.items[i].name));
                console.log(chalk.magenta.bold('Owner: ' + body.items[i].owner.login));
                console.log(chalk.grey('Desc: ' + body.items[i].description + '\n'));
                console.log(chalk.grey('Clone url: ' + body.items[i].clone_url + '\n'));
            }
            
            process.exit(0);
        }
        
        else if (error) {
            console.log(chalk.red('Error: ' + error));
            process.exit(1);
        }
    });
}
