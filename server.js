const CONSOLE_LOG = true;

if (CONSOLE_LOG === true) { console.log("[INFO] Node Server Starting."); }

let serverConfig;

let githubData = new Map;
let storageData = new Map;
let ecosystem;
let ecosystemObject;

//'use strict';
let http = require('http');
let port = process.env.PORT || 1337;

let isHttpServerStarted = false;

initialize();

function initialize() {

    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> Entering function."); }

    readServerConfig();

    function readServerConfig() {

        try {

            if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readServerConfig -> Entering function."); }

            let fs = require('fs');
        
            let fileName = './this.server.config.json';
            fs.readFile(fileName, onFileRead);

            function onFileRead(err, file) {

                try {

                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readServerConfig -> onFileRead -> Entering function."); }

                    let fileText;

                    fileText = file.toString();
                    fileText = fileText.trim(); // remove first byte with some encoding.

                    serverConfig = JSON.parse(fileText);

                    readEcosystemConfig();
                }
                catch (err) {
                    console.log("[ERROR] initialize -> readServerConfig -> onFileRead -> File = " + fileName + " Error = " + err);
                }

            }
        }
        catch (err) {
            console.log("[ERROR] initialize -> readServerConfig -> Error = " + err);
        }
    }

    function readEcosystemConfig() {

        try {

            if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readEcosystemConfig -> Entering function."); }

            if (CONSOLE_LOG === true && serverConfig.localMode === true) {

                console.log("Hey! if you expect this to run at the web server I have some bad news for you son, serverConfig.localMode is true, that means the server wont find your local files. ");

            }

            /*
    
            This configuration file is the backbone of the system. The first file we are going to get is a template where other configurations are
            injected and the files ends up inflated with all these configs in one single JSON object that in turn is later injected into a
            javascript module with an object that is going to instantiate it at run-time.
    
            */

            switch (serverConfig.storage.source) {

                case 'Cloud': {

                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readEcosystemConfig -> Cloud -> Entering Case."); }

                    getStorageData('AdvancedAlgos', 'AAPlatform', 'ecosystem.json', onDataArrived)

                    function onDataArrived(pData) {

                        try {

                            if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readEcosystemConfig -> Cloud -> onDataArrived -> Entering function."); }

                            ecosystem = pData.toString();
                            ecosystem = ecosystem.trim(); // remove first byte with some encoding.

                            ecosystemObject = JSON.parse(ecosystem);
                            readCompetitionsConfig();
                        }
                        catch (err) {
                            console.log("[ERROR] initialize -> readEcosystemConfig -> Cloud -> onDataArrived -> Error = " + err);
                        }
                    }

                    break;
                }

                case 'File System': {

                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readEcosystemConfig -> File System -> Entering Case."); }

                    let fs = require('fs');
                    try {
                        let fileName = '../AAPlatform/ecosystem.json';
                        fs.readFile(fileName, onFileRead);

                        function onFileRead(err, file) {

                            try {

                                if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readEcosystemConfig -> File System -> onFileRead -> Entering function."); }

                                ecosystem = file.toString();
                                ecosystem = ecosystem.trim(); // remove first byte with some encoding.

                                ecosystemObject = JSON.parse(ecosystem);
                                readCompetitionsConfig();
                            }
                            catch (err) {
                                console.log("[ERROR] initialize -> readEcosystemConfig -> File System -> onFileRead -> File = " + fileName + " Error = " + err);
                            }

                        }
                    }
                    catch (err) {
                        console.log("[ERROR] initialize -> readEcosystemConfig -> File System -> File = " + fileName + " Error = " + err);
                    }
                    break;
                }

                case 'Github': {

                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readEcosystemConfig -> Github -> Entering Case."); }

                    getGithubData('AdvancedAlgos', 'AAPlatform', 'ecosystem.json', onDataArrived)

                    function onDataArrived(pData) {

                        try {

                            if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readEcosystemConfig -> Github -> onDataArrived -> Entering function."); }

                            ecosystem = pData.toString();
                            ecosystem = ecosystem.trim(); // remove first byte with some encoding.

                            ecosystemObject = JSON.parse(ecosystem);
                            readCompetitionsConfig();
                        }
                        catch (err) {
                            console.log("[ERROR] initialize -> readEcosystemConfig -> Github -> onDataArrived -> Error = " + err);
                        }
                    }
                    break;
                }
            }
        }
        catch (err) {
            console.log("[ERROR] initialize -> readEcosystemConfig -> Error = " + err);
        }
    }

    function switchTemplate() {

        switch (serverConfig.storage.source) {

            case 'Cloud': {

                if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readEcosystemConfig -> Cloud -> Entering Case."); }

                break;
            }

            case 'File System': {

                if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readEcosystemConfig -> File System -> Entering Case."); }

                break;
            }

            case 'Github': {

                if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readEcosystemConfig -> Github -> Entering Case."); }

                break;
            }
        }

    }

    function readCompetitionsConfig() {

        try {

            if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Entering function."); }

            let requestsSent = 0;
            let responsesReceived = 0;

            for (let i = 0; i < ecosystemObject.hosts.length; i++) {

                let host = ecosystemObject.hosts[i];

                /* In this first section we will load the competitions configurations. */

                for (let j = 0; j < host.competitions.length; j++) {

                    let competition = host.competitions[j];

                    requestsSent++;

                    switch (serverConfig.storage.source) {

                        case 'Cloud': {

                            if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Cloud -> Entering Case."); }

                            getStorageData(host.codeName, competition.repo, competition.configFile, onDataArrived)

                            function onDataArrived(pData) {

                                try {

                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Cloud -> onDataArrived -> Entering function."); }
                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Cloud -> onDataArrived -> host.codeName = " + host.codeName); }
                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Cloud -> onDataArrived -> competition.repo = " + competition.repo); }
                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Cloud -> onDataArrived -> pData = " + pData); }

                                    responsesReceived++;

                                    pData = pData.toString();
                                    pData = pData.trim(); // remove first byte with some encoding.

                                    let configObj = JSON.parse(pData);

                                    /* Since we are going to replace the full bot object and we dont want to lose these two properties, we do this: */

                                    configObj.repo = competition.repo;
                                    configObj.configFile = competition.configFile;

                                    host.competitions[j] = configObj;

                                    if (requestsSent === responsesReceived) {

                                        readBotsAndPlottersConfig();

                                    }

                                }
                                catch (err) {
                                    console.log("[ERROR] initialize -> readCompetitionsConfig -> Cloud -> onDataArrived -> Error = " + err);
                                }
                            }
                            break;
                        }

                        case 'File System': {

                            try {
                                if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> File System -> Entering Case."); }

                                let fs = require('fs');
                            
                                let fileName = '../Competitions/' + host.codeName + '/' + competition.repo + '/' + competition.configFile;
                                fs.readFile(fileName, onFileRead);

                                function onFileRead(err, pData) {

                                    try {

                                        if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> File System -> onFileRead -> Entering function."); }
                                        if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> File System -> onFileRead -> fileName = " + fileName); }

                                        responsesReceived++;

                                        pData = pData.toString();
                                        pData = pData.trim(); // remove first byte with some encoding.

                                        let configObj = JSON.parse(pData);

                                        /* Since we are going to replace the full bot object and we dont want to lose these two properties, we do this: */

                                        configObj.repo = competition.repo;
                                        configObj.configFile = competition.configFile;

                                        host.competitions[j] = configObj;

                                        if (requestsSent === responsesReceived) {

                                            readBotsAndPlottersConfig();

                                        }
                                    }
                                    catch (err) {
                                        console.log("[INFO] initialize -> readCompetitionsConfig -> File System -> onFileRead -> File = " + fileName + " Error = " + err);
                                    }
                                }
                            }
                            catch (err) {
                                console.log("[ERROR] initialize -> readCompetitionsConfig -> File System -> File = " + fileName + " Error = " + err);
                            }

                            break;
                        }

                        case 'Github': {

                            if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Github -> Entering Case."); }

                            getGithubData(host.codeName, competition.repo, competition.configFile, onDataArrived)

                            function onDataArrived(pData) {

                                try {

                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Github -> onDataArrived -> Entering function."); }
                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Github -> onDataArrived -> host.codeName = " + host.codeName); }
                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Github -> onDataArrived -> competition.repo = " + competition.repo); }
                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Github -> onDataArrived -> pData = " + pData); }

                                    responsesReceived++;

                                    pData = pData.toString();
                                    pData = pData.trim(); // remove first byte with some encoding.

                                    let configObj = JSON.parse(pData);

                                    /* Since we are going to replace the full bot object and we dont want to lose these two properties, we do this: */

                                    configObj.repo = competition.repo;
                                    configObj.configFile = competition.configFile;

                                    host.competitions[j] = configObj;

                                    if (requestsSent === responsesReceived) {

                                        readBotsAndPlottersConfig();

                                    }

                                }
                                catch (err) {
                                    console.log("[ERROR] initialize -> readCompetitionsConfig -> Github -> onDataArrived -> Error = " + err);
                                }
                            }

                            break;
                        }
                    }
                }

                /* In this second section we will load the competition plotters configurations. */

                for (let j = 0; j < host.plotters.length; j++) {

                    let plotter = host.plotters[j];

                    requestsSent++;

                    switch (serverConfig.storage.source) {

                        case 'Cloud': {

                            if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Cloud -> Entering Case."); }

                            getStorageData(host.codeName, plotter.repo, plotter.configFile, onDataArrived)

                            function onDataArrived(pData) {

                                try {

                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Cloud -> onDataArrived -> Entering function."); }
                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Cloud -> onDataArrived -> host.codeName = " + host.codeName); }
                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Cloud -> onDataArrived -> plotter.repo = " + plotter.repo); }
                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Cloud -> onDataArrived -> pData = " + pData); }

                                    responsesReceived++;

                                    pData = pData.toString();
                                    pData = pData.trim(); // remove first byte with some encoding.

                                    let configObj = JSON.parse(pData);

                                    /* Since we are going to replace the full bot object and we dont want to lose these two properties, we do this: */

                                    configObj.repo = plotter.repo;
                                    configObj.configFile = plotter.configFile;

                                    host.plotters[j] = configObj;

                                    if (requestsSent === responsesReceived) {

                                        readBotsAndPlottersConfig();

                                    }

                                }
                                catch (err) {
                                    console.log("[ERROR] initialize -> readCompetitionsConfig -> Cloud -> onDataArrived -> Error = " + err);
                                }
                            }

                            break;
                        }

                        case 'File System': {

                            if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> File System -> Entering Case."); }

                            try {

                                let fs = require('fs');

                                let fileName = '../Plotters/' + host.codeName + '/' + plotter.repo + '/' + plotter.configFile;
                                fs.readFile(fileName, onFileRead);

                                function onFileRead(err, pData) {

                                    try {

                                        if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> File System -> onFileRead -> Entering function."); }
                                        if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> File System -> onFileRead -> fileName = " + fileName); }

                                        responsesReceived++;

                                        pData = pData.toString();
                                        pData = pData.trim(); // remove first byte with some encoding.

                                        let configObj = JSON.parse(pData);

                                        /* Since we are going to replace the full bot object and we dont want to lose these two properties, we do this: */

                                        configObj.repo = plotter.repo;
                                        configObj.configFile = plotter.configFile;

                                        host.plotters[j] = configObj;

                                        if (requestsSent === responsesReceived) {

                                            readBotsAndPlottersConfig();

                                        }
                                    }
                                    catch (err) {
                                        console.log("[ERROR] initialize -> readCompetitionsConfig -> File System -> onFileRead -> File = " + fileName + " Error = " + err);
                                    }

                                }
                            }
                            catch (err) {
                                console.log("[ERROR] initialize -> readCompetitionsConfig -> File System -> File = " + fileName + " Error = " + err);
                            }

                            break;
                        }

                        case 'Github': {

                            if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Github -> Entering Case."); }

                            getGithubData(host.codeName, plotter.repo, plotter.configFile, onDataArrived)

                            function onDataArrived(pData) {

                                try {

                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Github -> onDataArrived -> Entering function."); }
                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Github -> onDataArrived -> host.codeName = " + host.codeName); }
                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Github -> onDataArrived -> plotter.repo = " + plotter.repo); }
                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readCompetitionsConfig -> Github -> onDataArrived -> pData = " + pData); }

                                    responsesReceived++;

                                    pData = pData.toString();
                                    pData = pData.trim(); // remove first byte with some encoding.

                                    let configObj = JSON.parse(pData);

                                    /* Since we are going to replace the full bot object and we dont want to lose these two properties, we do this: */

                                    configObj.repo = plotter.repo;
                                    configObj.configFile = plotter.configFile;

                                    host.plotters[j] = configObj;

                                    if (requestsSent === responsesReceived) {

                                        readBotsAndPlottersConfig();

                                    }

                                }
                                catch (err) {
                                    console.log("[ERROR] initialize -> readCompetitionsConfig -> Github -> onDataArrived -> Error = " + err);
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
        catch (err) {
            console.log("[ERROR] initialize -> readCompetitionsConfig -> Error = " + err);
        }
    }

    function readBotsAndPlottersConfig() {

        try {

            if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readBotsAndPlottersConfig -> Entering function."); }

            /*
    
            Each bot has its configuration at its own repo since each team must be able to change it at will.
            So what we do here is to use the master config at the AAPlatform repo that we already have on
            memory and inject into it the config of each bot.
    
            Inmediatelly after that, we also load the Plotters configs using the same technique.
    
            */

            let requestsSent = 0;
            let responsesReceived = 0;

            for (let i = 0; i < ecosystemObject.devTeams.length; i++) {

                let devTeam = ecosystemObject.devTeams[i];

                /* In the next section we are loading the bots configurations. */

                for (let j = 0; j < devTeam.bots.length; j++) {

                    let bot = devTeam.bots[j];

                    requestsSent++;

                    if (serverConfig.localMode === true) {

                        let fs = require('fs');
                        try {
                            let fileName = '../Bots/' + devTeam.codeName + '/' + bot.repo + '/' + bot.configFile;
                            fs.readFile(fileName, onFileRead);

                            function onFileRead(err, pData) {

                                try {

                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readBotsAndPlottersConfig -> onFileRead -> Entering function."); }
                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readBotsAndPlottersConfig -> onFileRead -> fileName = " + fileName); }

                                    responsesReceived++;

                                    pData = pData.toString();
                                    pData = pData.trim(); // remove first byte with some encoding.

                                    let configObj = JSON.parse(pData);

                                    /* Since we are going to replace the full bot object and we dont want to lose these two properties, we do this: */

                                    configObj.repo = bot.repo;
                                    configObj.configFile = bot.configFile;

                                    addStoragePermissions(configObj);

                                    devTeam.bots[j] = configObj;

                                    if (requestsSent === responsesReceived) {

                                        startHtttpServer();

                                    }
                                }
                                catch (err) {
                                    console.log("[ERROR] initialize -> readBotsAndPlottersConfig -> onFileRead -> File = " + fileName + " Error = " + err);
                                }

                            }
                        }
                        catch (err) {
                            console.log("[ERROR] initialize -> readBotsAndPlottersConfig -> File = " + fileName + " Error = " + err);
                        }

                    } else {

                        getGithubData(devTeam.codeName, bot.repo, bot.configFile, onDataArrived)

                        function onDataArrived(pData) {

                            try {

                                if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readBotsAndPlottersConfig -> onDataArrived -> Entering function."); }
                                if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readBotsAndPlottersConfig -> onDataArrived -> devTeam.codeName = " + devTeam.codeName); }
                                if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readBotsAndPlottersConfig -> onDataArrived -> bot.repo = " + bot.repo); }
                                if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readBotsAndPlottersConfig -> onDataArrived -> pData = " + pData); }

                                responsesReceived++;

                                pData = pData.toString();
                                pData = pData.trim(); // remove first byte with some encoding.

                                let configObj = JSON.parse(pData);

                                /* Since we are going to replace the full bot object and we dont want to lose these two properties, we do this: */

                                configObj.repo = bot.repo;
                                configObj.configFile = bot.configFile;

                                addStoragePermissions(configObj);

                                devTeam.bots[j] = configObj;

                                if (requestsSent === responsesReceived) {

                                    startHtttpServer();

                                }

                            }
                            catch (err) {
                                console.log("[ERROR] initialize -> readBotsAndPlottersConfig -> onDataArrived -> Error = " + err);
                            }
                        }
                    }
                }

                /* In the next section we are loading the plotters configurations. */

                for (let j = 0; j < devTeam.plotters.length; j++) {

                    let plotter = devTeam.plotters[j];

                    requestsSent++;

                    if (serverConfig.localMode === true) {

                        let fs = require('fs');
                        try {
                            let fileName = '../Plotters/' + devTeam.codeName + '/' + plotter.repo + '/' + plotter.configFile;
                            fs.readFile(fileName, onFileRead);

                            function onFileRead(err, pData) {

                                try {

                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readBotsAndPlottersConfig -> onFileRead -> Entering function."); }
                                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readBotsAndPlottersConfig -> onFileRead -> fileName = " + fileName); }

                                    responsesReceived++;

                                    pData = pData.toString();
                                    pData = pData.trim(); // remove first byte with some encoding.

                                    let configObj = JSON.parse(pData);

                                    /* Since we are going to replace the full plotter object and we dont want to lose these two properties, we do this: */

                                    configObj.repo = plotter.repo;
                                    configObj.configFile = plotter.configFile;

                                    devTeam.plotters[j] = configObj;

                                    if (requestsSent === responsesReceived) {

                                        startHtttpServer();

                                    }
                                }
                                catch (err) {
                                    console.log("[ERROR] initialize -> readPlottersConfig -> onFileRead -> File = " + fileName + " Error = " + err);
                                }
                            }
                        }
                        catch (err) {
                            console.log("[ERROR] initialize -> readPlottersConfig -> File = " + fileName + " Error = " + err);
                        }

                    } else {

                        getGithubData(devTeam.codeName, plotter.repo, plotter.configFile, onDataArrived)

                        function onDataArrived(pData) {

                            try {

                                if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readBotsAndPlottersConfig -> onDataArrived -> Entering function."); }
                                if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readBotsAndPlottersConfig -> onDataArrived -> devTeam.codeName = " + devTeam.codeName); }
                                if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readBotsAndPlottersConfig -> onDataArrived -> plotter.repo = " + plotter.repo); }
                                if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readBotsAndPlottersConfig -> onDataArrived -> pData = " + pData); }

                                responsesReceived++;

                                pData = pData.toString();
                                pData = pData.trim(); // remove first byte with some encoding.

                                let configObj = JSON.parse(pData);

                                /* Since we are going to replace the full plotter object and we dont want to lose these two properties, we do this: */

                                configObj.repo = plotter.repo;
                                configObj.configFile = plotter.configFile;

                                devTeam.plotters[j] = configObj;

                                if (requestsSent === responsesReceived) {

                                    startHtttpServer();

                                }

                            }
                            catch (err) {
                                console.log("[ERROR] initialize -> readBotsAndPlottersConfig -> onDataArrived -> Error = " + err);
                            }
                        }
                    }
                }
            }

            function addStoragePermissions(pConfigObj) {

                try {

                    if (CONSOLE_LOG === true) { console.log("[INFO] initialize -> readBotsAndPlottersConfig -> addStoragePermissions -> Entering function."); }

                    if (pConfigObj.storage !== undefined) { return; } // If this information is at the config file, then we take it, otherwise, we define it here. 

                    let fileUri;
                    let sas;

                    switch (serverConfig.environment) {

                        case "Develop": {

                            fileUri = "https://aadevelop.blob.core.windows.net";
                            sas = "?sv=2017-07-29&ss=b&srt=sco&sp=rl&se=2019-01-01T17:39:27Z&st=2018-05-01T08:39:27Z&spr=https,http&sig=9atUljJam0E8zMg1VWQ0bGj2FqGYwtPIbImy5xyBMhE%3D"

                            break;
                        }

                        case "Production": {

                            fileUri = "https://aaproduction.blob.core.windows.net";
                            sas = "?sv=2017-07-29&ss=b&srt=sco&sp=rl&se=2019-01-01T03:17:16Z&st=2018-05-01T18:17:16Z&spr=https,http&sig=Ok4l7YxZlduPJrX31Y%2FHyajzxCHRnfEnTkoiRsYDXhk%3D"

                            break;
                        }
                    }

                    pConfigObj.storage = {
                        sas: sas,
                        fileUri: fileUri
                    };

                }
                catch (err) {
                    console.log("[ERROR] initialize -> readBotsAndPlottersConfig -> addStoragePermissions -> Error = " + err);
                }
            }

        }
        catch (err) {
            console.log("[ERROR] initialize -> readBotsAndPlottersConfig -> Error = " + err);
        }
    }
}

function startHtttpServer() {

    if (CONSOLE_LOG === true) { console.log("[INFO] startHtttpServer -> Entering function."); }

    try {

        if (isHttpServerStarted === false) {

            gWebServer = http.createServer(onBrowserRequest).listen(port);
            isHttpServerStarted = true;
        }
    }
    catch (err) {
        console.log("[ERROR] startHtttpServer -> Error = " + err);
    }
}

function onBrowserRequest(request, response) {

    if (CONSOLE_LOG === true) { console.log("[INFO] onBrowserRequest -> Entering function."); }
    if (CONSOLE_LOG === true) { console.log("[INFO] onBrowserRequest -> request.url = " + request.url); }

    var htmlResponse;
    var requestParameters = request.url.split("/");

    switch (requestParameters[1]) {

        case "clear-cache": {

            githubData = new Map;
            storageData = new Map;

            initialize();

            respondWithContent("command acepted", response);

        }
            break;
        case "Plotter.js":
            {
                /*

                This file is build dinamically because it has the code to instantiate the different configured Plotters. The instantiation code
                will be generated using a pre-defined string with replacement points. We will go through the configuration file to learn
                about all the possible plotters the system can load.

                */

                let fs = require('fs');
                try {
                    let fileName = 'Plotter.js';
                    fs.readFile(fileName, onFileRead);

                    function onFileRead(err, file) {

                        if (CONSOLE_LOG === true) { console.log("[INFO] onBrowserRequest -> onFileRead -> Entering function."); }

                        try {

                            let fileContent = file.toString();

                            /* This is the string we will use to insert into the Plotters.js script. */

                            let caseString = '' +
                                '        case "@newFunctionName@":' + '\n' +
                                '        {' + '\n' +
                                '            plotter = newPlotterName();' + '\n' +
                                '        }' + '\n' +
                                '        break;' + '\n' + '\n' 

                            let devTeams = ecosystemObject.devTeams;
                            let hosts = ecosystemObject.hosts;

                            addToFileContent(devTeams);
                            addToFileContent(hosts);

                            function addToFileContent(pDevTeamsOrHosts) {

                                if (CONSOLE_LOG === true) { console.log("[INFO] onBrowserRequest -> onFileRead -> addToFileContent -> Entering function."); }

                                for (let i = 0; i < pDevTeamsOrHosts.length; i++) {

                                    let devTeam = pDevTeamsOrHosts[i];

                                    for (let j = 0; j < devTeam.plotters.length; j++) {

                                        let plotter = devTeam.plotters[j];

                                        for (let k = 0; k < plotter.modules.length; k++) {

                                            let module = plotter.modules[k];

                                            let caseStringCopy = caseString;

                                            let newFunctionName = devTeam.codeName + plotter.codeName + module.codeName;
                                            newFunctionName = newFunctionName.replace(/-/g, "");

                                            let stringToInsert;
                                            stringToInsert = caseStringCopy.replace('@newFunctionName@', newFunctionName);
                                            stringToInsert = stringToInsert.replace('newPlotterName', 'new' + newFunctionName);

                                            let firstPart = fileContent.substring(0, fileContent.indexOf('// Cases'));
                                            let secondPart = fileContent.substring(fileContent.indexOf('// Cases'));

                                            fileContent = firstPart + stringToInsert + secondPart;
                                        }
                                    }
                                }
                            }

                            respondWithContent(fileContent, response);

                        }
                        catch (err) {
                            console.log("[ERROR] onBrowserRequest -> File Not Found: " + fileName + " or Error = " + err);
                        }

                    }
                }
                catch (err) {
                    console.log(err);
                }

            }
            break;

        case "PlotterPanel.js":
            {
                /*

                This file is build dinamically because it has the code to instantiate the different configured Plotter Panels. The instantiation code
                will be generated using a pre-defined string with replacement points. We will go through the configuration file to learn
                about all the possible plotters panels the system can load.

                */

                let fs = require('fs');
                try {
                    let fileName = 'PlotterPanel.js';
                    fs.readFile(fileName, onFileRead);

                    function onFileRead(err, file) {

                        if (CONSOLE_LOG === true) { console.log("[INFO] onBrowserRequest -> onFileRead -> Entering function."); }

                        try {

                            let fileContent = file.toString();

                            /* This is the string we will use to insert into the Plotters.js script. */

                            let caseString = '' +
                                '        case "@newFunctionName@":' + '\n' +
                                '        {' + '\n' +
                                '            plotterPanel = newPlotterPanelName();' + '\n' +
                                '        }' + '\n' +
                                '        break;' + '\n' + '\n'

                            let devTeams = ecosystemObject.devTeams;
                            let hosts = ecosystemObject.hosts;

                            addToFileContent(devTeams);
                            addToFileContent(hosts);

                            function addToFileContent(pDevTeamsOrHosts) {

                                if (CONSOLE_LOG === true) { console.log("[INFO] onBrowserRequest -> onFileRead -> addToFileContent -> Entering function."); }

                                for (let i = 0; i < pDevTeamsOrHosts.length; i++) {

                                    let devTeam = pDevTeamsOrHosts[i];

                                    for (let j = 0; j < devTeam.plotters.length; j++) {

                                        let plotter = devTeam.plotters[j];

                                        for (let k = 0; k < plotter.modules.length; k++) {

                                            let module = plotter.modules[k];

                                            for (let l = 0; l < module.panels.length; l++) {

                                                let panel = module.panels[l];

                                                let caseStringCopy = caseString;

                                                let newFunctionName = devTeam.codeName + plotter.codeName + module.codeName + panel.codeName;
                                                newFunctionName = newFunctionName.replace(/-/g, "");

                                                let stringToInsert;
                                                stringToInsert = caseStringCopy.replace('@newFunctionName@', newFunctionName);
                                                stringToInsert = stringToInsert.replace('newPlotterPanelName', 'new' + newFunctionName);

                                                let firstPart = fileContent.substring(0, fileContent.indexOf('// Cases'));
                                                let secondPart = fileContent.substring(fileContent.indexOf('// Cases'));

                                                fileContent = firstPart + stringToInsert + secondPart;
                                            }
                                        }
                                    }
                                }
                            }

                            respondWithContent(fileContent, response);

                        }
                        catch (err) {
                            console.log("[ERROR] onBrowserRequest -> File Not Found: " + fileName + " or Error = " + err);
                        }

                    }
                }
                catch (err) {
                    console.log(err);
                }

            }
            break;

        case "Ecosystem.js":
            {
                /*

                At this page we need to insert the configuration file for the whole system that we assamble before at the begining of this module
                execution. So what we do is to load a template file with an insertion point where the configuration json is injected in. 

                */

                let fs = require('fs');
                try {
                    let fileName = 'Ecosystem.js';
                    fs.readFile(fileName, onFileRead);

                    function onFileRead(err, file) {

                        if (CONSOLE_LOG === true) { console.log("[INFO] onBrowserRequest -> onFileRead -> Entering function."); }

                        try {

                            let fileContent = file.toString();
                            let insertContent = JSON.stringify(ecosystemObject); 

                            fileContent = fileContent.replace('"@ecosystem.json@"', insertContent); 

                            respondWithContent(fileContent, response);

                        }
                        catch (err) {
                            console.log("[ERROR] onBrowserRequest -> File Not Found: " + fileName + " or Error = " + err);
                        }
                    }
                }
                catch (err) {
                    console.log(err);
                }

            }
            break;

        case "Plotters": // This means the plotter folder, not to be confused with the Plotters script!
            {

                if (serverConfig.localMode === true) {

                    respondWithFile('../Plotters/' + requestParameters[2] + '/' + requestParameters[3] + '/' + requestParameters[4], response);

                } else {

                    getGithubData(requestParameters[2], requestParameters[3], requestParameters[4], onDataArrived)

                    function onDataArrived(pData) {

                        respondWithContent(pData, response);

                    }
                }
            }
            break; 

        case "PlotterPanels": // This means the PlotterPanels folder, not to be confused with the Plotter Panels scripts!
            {

                if (serverConfig.localMode === true) {

                    respondWithFile('../Plotters/' + requestParameters[2] + '/' + requestParameters[3] + '/' + requestParameters[4], response);

                } else {

                    getGithubData(requestParameters[2], requestParameters[3], requestParameters[4], onDataArrived)

                    function onDataArrived(pData) {

                        respondWithContent(pData, response);

                    }
                }
            }
            break; 
        case "Panels":
            {
                respondWithFile('./' + requestParameters[1] + '/' + requestParameters[2], response);
            }
            break;

        case "ChartLayers":
            {
                respondWithFile('./' + requestParameters[1] + '/' + requestParameters[2], response);
            }
            break;

        case "Azure":
            {
                respondWithFile('./' + requestParameters[1] + '/' + requestParameters[2], response);
            }
            break;

        case "Spaces":
            {
                respondWithFile('./' + requestParameters[1] + '/' + requestParameters[2], response);
            }
            break;

        case "Files":
            {
                respondWithFile('./' + requestParameters[1] + '/' + requestParameters[2], response);
            }
            break;

        case "FloatingSpace":
            {
                respondWithFile('./' + requestParameters[1] + '/' + requestParameters[2], response);
            }
            break;

        default:

            if (requestParameters[1] === "") {

                let fs = require('fs');
                try {
                    let fileName = 'index.html';
                    fs.readFile(fileName, onFileRead);

                    function onFileRead(err, file) {

                        if (CONSOLE_LOG === true) { console.log("[INFO] onBrowserRequest -> onFileRead -> Entering function."); }

                        try {

                            let fileContent = file.toString();

                            addPlotters();
                            addImages();

                            function addPlotters() {

                                if (CONSOLE_LOG === true) { console.log("[INFO] onBrowserRequest -> onFileRead -> addPlotters -> Entering function."); }

                                let htmlLinePlotter = '' + '\n' +
                                    '    <script type="text/javascript" src="Plotters/@devTeam@/@repo@/@module@.js"></script>'

                                let htmlLinePlotterPanel = '' + '\n' +
                                    '    <script type="text/javascript" src="PlotterPanels/@devTeam@/@repo@/@module@.js"></script>'

                                let devTeams = ecosystemObject.devTeams;
                                let hosts = ecosystemObject.hosts;

                                addScript(devTeams);
                                addScript(hosts);

                                function addScript(pDevTeamsOrHosts) {

                                    if (CONSOLE_LOG === true) { console.log("[INFO] onBrowserRequest -> onFileRead -> addPlotters -> addScript -> Entering function."); }

                                    for (let i = 0; i < pDevTeamsOrHosts.length; i++) {

                                        let devTeam = pDevTeamsOrHosts[i];

                                        for (let j = 0; j < devTeam.plotters.length; j++) {

                                            let plotter = devTeam.plotters[j];

                                            for (let k = 0; k < plotter.modules.length; k++) {

                                                let module = plotter.modules[k];

                                                let htmlLineCopy = htmlLinePlotter;

                                                let stringToInsert;
                                                stringToInsert = htmlLineCopy.replace('@devTeam@', devTeam.codeName);
                                                stringToInsert = stringToInsert.replace('@repo@', plotter.repo);
                                                stringToInsert = stringToInsert.replace('@module@', module.moduleName);

                                                let firstPart = fileContent.substring(0, fileContent.indexOf('<!--Plotters-->') + 15);
                                                let secondPart = fileContent.substring(fileContent.indexOf('<!--Plotters-->') + 15);

                                                fileContent = firstPart + stringToInsert + secondPart;

                                                for (let l = 0; l < module.panels.length; l++) {

                                                    let panel = module.panels[l];

                                                    let htmlLineCopy = htmlLinePlotterPanel;

                                                    let stringToInsert;
                                                    stringToInsert = htmlLineCopy.replace('@devTeam@', devTeam.codeName);
                                                    stringToInsert = stringToInsert.replace('@repo@', plotter.repo);
                                                    stringToInsert = stringToInsert.replace('@module@', panel.moduleName);

                                                    let firstPart = fileContent.substring(0, fileContent.indexOf('<!--PlotterPanels-->') + 20);
                                                    let secondPart = fileContent.substring(fileContent.indexOf('<!--PlotterPanels-->') + 20);

                                                    fileContent = firstPart + stringToInsert + secondPart;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            function addImages() {

                                if (CONSOLE_LOG === true) { console.log("[INFO] onBrowserRequest -> onFileRead -> addImages -> Entering function."); }

                                const htmlLine = '' + '\n' +
                                    '    <img id="@id@" width="0" height="0" src="https://raw.githubusercontent.com/@devTeam@/@repo@/master/@image@">'

                                let devTeams = ecosystemObject.devTeams;

                                addScript(devTeams);

                                function addScript(pDevTeams) {

                                    if (CONSOLE_LOG === true) { console.log("[INFO] onBrowserRequest -> onFileRead -> addImages -> addScript -> Entering function."); }

                                    for (let i = 0; i < pDevTeams.length; i++) {

                                        let devTeam = pDevTeams[i];

                                        let htmlLineCopy = htmlLine;

                                        let stringToInsert;
                                        stringToInsert = htmlLineCopy.replace('@devTeam@', devTeam.codeName);
                                        stringToInsert = stringToInsert.replace('@repo@', devTeam.codeName + "-Dev-Team");
                                        stringToInsert = stringToInsert.replace('@image@', devTeam.codeName + ".png");
                                        stringToInsert = stringToInsert.replace('@id@', devTeam.codeName + ".png");

                                        let firstPart = fileContent.substring(0, fileContent.indexOf('<!--Images-->') + 15);
                                        let secondPart = fileContent.substring(fileContent.indexOf('<!--Images-->') + 15);

                                        fileContent = firstPart + stringToInsert + secondPart;

                                        for (let j = 0; j < devTeam.bots.length; j++) {

                                            let bot = devTeam.bots[j];

                                            if (bot.profilePicture !== undefined) {

                                                let htmlLineCopy = htmlLine;

                                                let stringToInsert;
                                                stringToInsert = htmlLineCopy.replace('@devTeam@', devTeam.codeName);
                                                stringToInsert = stringToInsert.replace('@repo@', bot.repo);
                                                stringToInsert = stringToInsert.replace('@image@', bot.profilePicture);
                                                stringToInsert = stringToInsert.replace('@id@', devTeam.codeName + "." + bot.profilePicture);

                                                let firstPart = fileContent.substring(0, fileContent.indexOf('<!--Images-->') + 15);
                                                let secondPart = fileContent.substring(fileContent.indexOf('<!--Images-->') + 15);

                                                fileContent = firstPart + stringToInsert + secondPart;

                                            }
                                        }

                                        for (let j = 0; j < devTeam.plotters.length; j++) {

                                            let plotter = devTeam.plotters[j];

                                            for (let k = 0; k < plotter.modules.length; k++) {

                                                let module = plotter.modules[k];

                                                if (module.profilePicture !== undefined) {

                                                    let htmlLineCopy = htmlLine;

                                                    let stringToInsert;
                                                    stringToInsert = htmlLineCopy.replace('@devTeam@', devTeam.codeName);
                                                    stringToInsert = stringToInsert.replace('@repo@', plotter.repo);
                                                    stringToInsert = stringToInsert.replace('@image@', module.profilePicture);
                                                    stringToInsert = stringToInsert.replace('@id@', devTeam.codeName + "." + plotter.codeName + "." + module.codeName + "." + module.profilePicture);

                                                    let firstPart = fileContent.substring(0, fileContent.indexOf('<!--Images-->') + 15);
                                                    let secondPart = fileContent.substring(fileContent.indexOf('<!--Images-->') + 15);

                                                    fileContent = firstPart + stringToInsert + secondPart;

                                                } 
                                            }
                                        }
                                    }
                                }
                            }
                           

                            respondWithContent(fileContent, response);

                        }
                        catch (err) {
                            console.log("[ERROR] onBrowserRequest -> File Not Found: " + fileName + " or Error = " + err);
                        }
                    }
                }
                catch (err) {
                    console.log(err);
                }
            } else {

                respondWithFile("" + requestParameters[1], response);

            }
    }

    function sendResponseToBrowser(htmlResponse) {

        if (CONSOLE_LOG === true) { console.log("[INFO] onBrowserRequest -> sendResponseToBrowser -> Entering function."); }

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(htmlResponse);

        response.end("\n");
    }
}

function respondWithContent(content, response) {

    if (CONSOLE_LOG === true) { console.log("[INFO] respondWithContent -> Entering function."); }

    try {

        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
        response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
        response.setHeader("Expires", "0"); // Proxies.
        response.setHeader("Access-Control-Allow-Origin", "*"); // Allows to access data from other domains.

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(content);
        response.end("\n");
        //console.log("Content Sent: " + content);

    }
    catch (err) {
        returnEmptyArray();
    }
}

function respondWithFile(fileName, response) {

    if (CONSOLE_LOG === true) { console.log("[INFO] respondWithFile -> Entering function."); }

    let fs = require('fs');
    try {

        fs.readFile(fileName, onFileRead);

        function onFileRead(err, file) {

            if (CONSOLE_LOG === true) { console.log("[INFO] respondWithFile -> onFileRead -> Entering function."); }

            try {
                let htmlResponse = file.toString();

                response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
                response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
                response.setHeader("Expires", "0"); // Proxies.
                response.setHeader("Access-Control-Allow-Origin", "*"); // Allows to access data from other domains.

                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.write(htmlResponse);
                response.end("\n");
                //console.log("File Sent: " + fileName);
                //
            }
            catch (err) {
                returnEmptyArray();
                console.log("File Not Found: " + fileName);
                console.log("[ERROR] respondWithFile -> onFileRead -> File Not Found: " + fileName + " or Error = " + err);
            }

        }
    }
    catch (err) {
        returnEmptyArray();
    }

    function returnEmptyArray() {

        if (CONSOLE_LOG === true) { console.log("[INFO] respondWithFile -> returnEmptyArray -> Entering function."); }

        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
        response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
        response.setHeader("Expires", "0"); // Proxies.

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write("[]");
        response.end("\n");

    }
}

function getGithubData(pOrg, pRepo, pPath, callBackFunction) {

    try {

        if (CONSOLE_LOG === true) { console.log("[INFO] getGithubData -> Entering function."); }

        let cacheVersion = githubData.get(pOrg + '.' + pRepo + '.' + pPath)

        if (cacheVersion !== undefined) {

            if (CONSOLE_LOG === true) { console.log("[INFO] getGithubData -> " + pOrg + '.' + pRepo + '.' + pPath + " found at cache."); }

            callBackFunction(cacheVersion);

        } else {

            if (CONSOLE_LOG === true) { console.log("[INFO] getGithubData -> " + pOrg + '.' + pRepo + '.' + pPath + " NOT found at cache."); }

            const octokit = require('@octokit/rest')()
            global.atob = require("atob");

            let owner = pOrg;
            let repo = pRepo;
            let branch = "master";
            let page = 1;
            let per_page = 100;
            let ref = "master";
            let path = pPath;

            octokit.repos.getContent({ owner, repo, path, ref }, onContent);

            function onContent(error, result) {

                try {

                    if (CONSOLE_LOG === true) { console.log("[INFO] getGithubData -> onContent -> Entering function."); }
                    if (CONSOLE_LOG === true) { console.log("[INFO] getGithubData -> onContent -> error = " + error); }
                    if (CONSOLE_LOG === true) { console.log("[INFO] getGithubData -> onContent -> Github.com responded to request " + pOrg + '.' + pRepo + '.' + pPath + " with result = " + result.toString().substring(0, 100)); }

                    if (error !== null) { console.log("[ERROR] getGithubData -> onContent -> " + error); }

                    let decoded = atob(result.data.content);

                    /*
        
                    This method usually brings up to 3 characters of encoding info at the begining of the JSON string which destroys the JSON format.
                    We will run the following code with the intention to eliminate this problem. 
        
                    */

                    let cleanString = decoded;
                    let jsonTest;

                    try {
                        jsonTest = JSON.parse(cleanString);
                    } catch (err) {
                        cleanString = decoded.substring(1);
                        try {
                            jsonTest = JSON.parse(cleanString);
                        } catch (err) {
                            cleanString = decoded.substring(2);
                            try {
                                jsonTest = JSON.parse(cleanString);
                            } catch (err) {
                                cleanString = decoded.substring(3);
                                try {
                                    jsonTest = JSON.parse(cleanString);
                                } catch (err) {
                                    console.log("[INFO] getGithubData -> onContent -> Could not clean the data received -> Data = " + decoded.substring(0, 50));
                                }
                            }
                        }
                    }

                    githubData.set(pOrg + '.' + pRepo + '.' + pPath, cleanString);

                    callBackFunction(cleanString);

                } catch (err) {
                    console.log("[ERROR] getGithubData -> onContent -> err.message = " + err.message);
                    callBackFunction("{}");
                }
            }
        }

    } catch (err) {
        console.log("[ERROR] getGithubData -> err.message = " + err.message);
        callBackFunction("{}");
    }
}

function getStorageData(pOrg, pRepo, pPath, callBackFunction) {

    try {

        if (CONSOLE_LOG === true) { console.log("[INFO] getStorageData -> Entering function."); }

        let cacheVersion = storageData.get(pOrg + '.' + pRepo + '.' + pPath)

        if (cacheVersion !== undefined) {

            if (CONSOLE_LOG === true) { console.log("[INFO] getStorageData ->  " + pOrg + '.' + pRepo + '.' + pPath + " found at cache."); }

            callBackFunction(cacheVersion);

        } else {

            if (CONSOLE_LOG === true) { console.log("[INFO] getStorageData ->  " + pOrg + '.' + pRepo + '.' + pPath + " NOT found at cache."); }

            let storage = require('azure-storage');
            let blobService = storage.createBlobService(serverConfig.storage.connectionString);

            blobService.getBlobToText('aaplatform', pOrg + "/" + pRepo + "/" + pPath, onFileReceived);


            function onFileReceived(err, text, response) {

                try {

                    if (CONSOLE_LOG === true) { console.log("[INFO] getStorageData -> onFileReceived -> Entering function."); }
                    if (CONSOLE_LOG === true) { console.log("[INFO] getStorageData -> onContent -> err = " + JSON.stringify(err)); }
                    if (CONSOLE_LOG === true) { console.log("[INFO] getStorageData -> onContent ->  response = " + JSON.stringify(response)); }

                    storageData.set(pOrg + '.' + pRepo + '.' + pPath, text);

                    callBackFunction(text);

                } catch (err) {
                    console.log("[ERROR] getStorageData -> onFileReceived -> err.message = " + err.message);
                    callBackFunction("{}");
                }
            }
        }

    } catch (err) {
        console.log("[ERROR] getStorageData -> err.message = " + err.message); 
        callBackFunction("{}");
    }
}