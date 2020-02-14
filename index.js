// DeepCode - Demo Tool to flatten JSON files from CLI
//
// 2020 by 0xff
//

const fs = require('fs');

// Globals
let InputFile;
let OutputFile;

let InputObj;
let OutputObj;

// Read/Write  JSON files
function readInput() {
    InputJSON = null;
    let RawData;

    try {
      RawData = fs.readFileSync(InputFile);
    } catch(err) {
        logError("Error reading file: " + err);
        process.exit();
    }
    
    try {
      InputObj = JSON.parse(RawData);
    } catch(err) {
        logError("Error parsing input file: " + err);
        process.exit();
    }

}

function writeOutput() {
    try {
        fs.writeFileSync(OutputFile, JSON.stringify(OutputObj,null," "),'utf8');
    } catch(err) {
        logError("Error writing output: " + err);
        process.exit();
    }
}

//Decode arguments
function decodeArgs() {
    
    let args = process.argv.slice(2);

    if(args.length < 4) {
        logError("Not enough parameters provided");
        printUsage();
        process.exit();
    }

    inputFile = outputFile = null;

    if(args[0].startsWith("-i")) {
        InputFile = args[1];
    }
    if(args[2].startsWith("-o")) {
        OutputFile = args[3];
    }

    if(InputFile == null || OutputFile == null) {
        logError("Something is wrong with the arguments");
        printUsage();
        process.exit();
    }
}

// Console printing 
function logError(msg) {
    console.log("Error:" + msg);
}

function printUsage() {
    console.log("DeepCode Flattener - Usage: flattener -i [Input] -o [Output]");
    console.log("  [Input] - Input file, JSON as output from DeepCode CLI");
    console.log("  [Output] - Output file, where to write flattened JSON");
}

function printWelcome() {
    console.log("DeepCode - Flattener");
}

// Flattens existing JSON
function generateFlatJSON(){
    OutputObj = {};

    OutputObj.id = InputObj.id;
    OutputObj.url = InputObj.url;

    OutputObj.results = generateFlatResults();
}

function generateFlatResults() {
    let Suggestions = InputObj.results.suggestions;
    let returnObject = {};

    for(const file in InputObj.results.files) {
        let newEntry = {};
        for(const entry in InputObj.results.files[file]) {
            newEntry[entry] = InputObj.results.files[file][entry];
            newEntry[entry][0].suggestion = Suggestions[entry];
        }

        returnObject[file] = newEntry;
    }

    return returnObject;
}


decodeArgs();
printWelcome();
readInput();
generateFlatJSON();
writeOutput();


