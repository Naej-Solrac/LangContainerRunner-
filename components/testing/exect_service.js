const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const { spawn } = require('child_process');


const listDockerContainers = () => {
    return new Promise((resolve, reject) => {
        exec('docker ps', (error, stdout, stderr) => {
            if (error) {
                return reject({ status: 500, error: `Error executing docker list: ${error.message}` });
            }
            if (stderr) {
                return reject({ status: 500, error: stderr });
            }
            resolve(stdout);
        });
    });
};


const objeto = (language) => {
    const languages = {
        Python: {
            dockerImage: "python-executor", // Asegúrate de que esta imagen tiene pytest instalado
            fileExtension: ".py",
        },
        Php: {
            dockerImage: "php-executor", // Asegúrate de que esta imagen tenga PHPUnit instalado
            fileExtension: ".php",
        },
        Cpp: {
            dockerImage: "cpp-executor", // Asegúrate de que esta imagen tenga g++ instalado
            fileExtension: ".cpp",
        },

        Java: {
            dockerImage: "openjdk", // Asegúrate de que esta imagen tenga Maven y JUnit instalado si vas a usarlos
            fileExtension: ".java",
        }
    };
    return languages[language];
}


function getCommandsForLanguage(langConfig) {
    console.log("getCommandsForLanguage");
    switch(langConfig) {
        case 'Java':
            return {
                compileAndRun: `javac /app/code.java && java -cp /app code`,
                compileAndTest: `javac /app/test_code.java && java -cp /app test_code`
            };
            case 'Python':
            return {
                compileAndRun: 'python /app/code.py',
                compileAndTest: 'pytest /app/test_code.py'
            };
        case 'Php':
            return {
                compileAndRun: `php /app/code.php`,
                compileAndTest: `php /app/test_code.php`
            };
        case 'Cpp':
            return {
                compileAndRun: `g++ /app/code.cpp -o /app/executable && /app/executable`,
                compileAndTest: `g++ /app/test_code.cpp -o /app/executable && /app/executable`
            };
        // Añade más lenguajes según sea necesario
        default:
            return null;
    }
}



function executeCommandInContainer(containerName, command) {
    return new Promise((resolve, reject) => {
        console.log("Executing command in container");
        console.log("Container Name:", containerName);
        console.log("Command:", command);

        const exec = spawn('docker', ['exec', containerName, 'sh', '-c', command]);
        let output = '';
        let errorOutput = '';

        exec.stdout.on('data', (data) => {
            console.log("Hola")
            console.log(`stdout: ${data.toString()}`);
            output += data.toString();
        });

        exec.stderr.on('data', (data) => {
            console.log("Hola 2")
            console.error(`stderr: ${data.toString()}`);
            errorOutput += data.toString();
        });

        exec.on('close', (code) => {
            console.log("Hola 3")
            console.log(`Command execution finished with code ${code}`);
            if (code === 0) {
                    resolve(output || "jelou") 
            } else {
                resolve("output")
            }
        });

        exec.on('error', (err) => {
            console.error("Failed to start command execution:", err);
            reject({
                error: "Failed to start command execution",
                details: err.message
            });
        });
    });
}


function executeCommandInContainer2(containerName, command) {
    return new Promise((resolve, reject) => {
        console.log("Executing command in container");
        console.log("Container Name:", containerName);
        console.log("Command:", command);

        const exec = spawn('docker', ['exec', containerName, 'sh', '-c', command]);
        let output = '';
        let errorOutput = '';

        exec.stdout.on('data', (data) => {
            console.log(`stdout: ${data.toString()}`);
            output += data.toString();
        });

        exec.stderr.on('data', (data) => {
            console.error(`stderr: ${data.toString()}`);
            errorOutput += data.toString();
        });

        exec.on('close', (code) => {
            console.log(`Command execution finished with code ${code}`);
            if (code === 0) {
                const results = parseResultsToExecutionsJava(output);
                resolve(results);
            } else {
                reject({
                    error: "Command execution failed",
                    details: errorOutput
                });
            }
        });

        exec.on('error', (err) => {
            console.error("Failed to start command execution:", err);
            reject({
                error: "Failed to start command execution",
                details: err.message
            });
        });
    });
}

function parseResultsToExecutionsJava(resultsString) {
    const lines = resultsString.trim().split('\n');
    const results = {};

    lines.forEach((line, index) => {
        const key = `output${index + 1}`;
        results[key] = line.trim();
    });

    return results;
}

function executeCommandInContainer4(containerName, command) {
    return new Promise((resolve, reject) => {
        console.log("Executing command in container");
        console.log("Container Name:", containerName);
        console.log("Command:", command);

        const exec = spawn('docker', ['exec', containerName, 'sh', '-c', command]);

        let outputLines = [];
        let errorOutput = '';

        exec.stdout.on('data', (data) => {
            console.log("Procesando salida estándar...");
            const lines = data.toString().split(/\r?\n/);
            lines.forEach(line => {
                if (line) outputLines.push(line);
            });
        });

        exec.stderr.on('data', (data) => {
            console.error("Procesando errores...");
            errorOutput += data.toString();
        });

        exec.on('close', (code) => {
            console.log(`La ejecución del comando finalizó con el código ${code}`);
            if (code === 0) {
                const results = parseResultsToExecutionsPhp(outputLines.join('\n'));
                resolve(results);
            } else {
                reject({
                    error: "La ejecución del comando finalizó con errores",
                    code: code,
                    errorOutput: errorOutput
                });
            }
        });

        exec.on('error', (err) => {
            console.error("Error al iniciar la ejecución del comando:", err);
            reject({
                error: "Failed to start command execution",
                details: err.message
            });
        });
    });
}

function parseResultsToExecutionsPhp(resultsString) {
    const lines = resultsString.trim().split('\n');
    const results = {};

    lines.forEach((line, index) => {
        const key = `test${index + 1}`;
        const status = line.toLowerCase().includes('failed') ? 'FAILED' : 'PASSED';
        results[key] = {
            status: status,
            description: line.trim()
        };
    });

    return results;
}




function executeCommandInContainer3(containerName, command) {
    return new Promise((resolve, reject) => {
        console.log("Executing command in container");
        console.log("Container Name:", containerName);
        console.log("Command:", command);

        const exec = spawn('docker', ['exec', containerName, 'sh', '-c', command]);
        let errorOutput = '';  // Solo nos enfocamos en capturar stderr

        exec.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        exec.on('close', (code) => {
            console.log(`Command execution finished with code ${code}`);
            if (code === 0) {
                resolve("No errors detected.");
            } else {
                // Enviamos el stderr a parseFailedTests para analizar y formatear los fallos
                const failedTests = parseFailedTests(errorOutput);
                resolve({
                    status: "Failure",
                    failedTests: failedTests,
                    errorOutput: errorOutput.trim()
                });
            }
        });

        exec.on('error', (err) => {
            console.error("Failed to start command execution:", err);
            reject({
                error: "Failed to start command execution",
                details: err.message
            });
        });
    });
}
    
    function parseFailedTests(stderr) {
        const lines = stderr.split('\n');
        const failedTests = lines
            .filter(line => line.includes('Assertion'))
            .map(line => {
                const match = line.match(/test_([a-zA-Z0-9_]+)\(\):/);
                return match ? `${match[1]} FAIL` : "Unknown test FAIL";
            });
        return failedTests.length ? failedTests.join(', ') : "No failed tests detected.";
    }


    function parseFailedTestsC(stderr) {
        const lines = stderr.split('\n');
        const failedTests = [];
    
        for (let line of lines) {
            if (line.includes('Assertion')) {
                const testNameMatch = line.match(/test_([a-zA-Z0-9_]+)\(\):/);
                const testName = testNameMatch ? testNameMatch[1] : "Unknown test";
                const messageMatch = line.match(/failed\.\n\s*(.+)$/); // Suponiendo que el mensaje de fallo sigue inmediatamente después de 'failed.'
                const message = messageMatch ? messageMatch[1].trim() : "No additional error info";
                failedTests.push(`${testName} FAIL: ${message}`);
            }
        }
        return failedTests.length ? failedTests.join(', ') : "No failed tests detected.";
    }
    





function parsePytestResults(pytestOutput) {
    return new Promise((resolve, reject) => {
      // Dividir el texto de salida en líneas
      const lines = pytestOutput.split('\n');
  
      // Preparar el objeto JSON para los resultados
      const result = {
        passed: [],
        failed: [],
        summary: {}
      };
  
      // Variables de ayuda para la lógica de análisis
      let collectingError = false;
      let errorMessage = [];
      let currentTestName = '';
  
      lines.forEach(line => {
        // Capturar los resultados de cada test
        const testResultMatch = line.match(/test_code\.py\s+([.F]+)/);
        if (testResultMatch && testResultMatch[1]) {
          // Registrar resultados de cada test
          const results = testResultMatch[1].split('');
          results.forEach((testResult, index) => {
            const testName = `test ${index + 1}`;
            if (testResult === '.') {
              result.passed.push({ testName });
            } else if (testResult === 'F') {
              result.failed.push({ testName, error: '' });
            }
          });
        }
  
        // Identificar y capturar detalles del error
        if (line.includes('test_code.py::')) {
          currentTestName = line.split(' ')[0];
          collectingError = true;
        } else if (collectingError) {
          if (line.trim() !== '') {
            errorMessage.push(line.trim());
          } else {
            result.failed.forEach(test => {
              if (test.testName === currentTestName && !test.error) {
                test.error = errorMessage.join('\n');
              }
            });
            errorMessage = [];
            collectingError = false;
          }
        }
      });
  
      // Resumen de resultados
      const summaryMatch = pytestOutput.match(/(\d+) failed, (\d+) passed in (.+?)s/);
      if (summaryMatch) {
        result.summary = {
          failed: parseInt(summaryMatch[1]),
          passed: parseInt(summaryMatch[2]),
          time: summaryMatch[3]
        };
      }
  
      // Resolver la promesa con el resultado, o rechazarla si no se encontraron tests
      if (result.passed.length > 0 || result.failed.length > 0) {
        resolve(result);
      } else {
        reject(new Error("No test results found."));
      }
    });
  }
  

function parsePythonTestOutput(output) {
    const result = {
        tests: [],
        summary: ""
    };

    // Simple regex patterns to extract test results and summary
    const testPattern = /(.+?)::(.+?) (PASSED|FAILED|SKIPPED)/g;
    const summaryPattern = /\d+ passed, \d+ failed, \d+ skipped, \d+ deselected, \d+ errors in [\d\.]+s/g;

    let match;
    while ((match = testPattern.exec(output))) {
        result.tests.push({
            test: match[2],
            status: match[3]
        });
    }

    const summaryMatch = summaryPattern.exec(output);
    if (summaryMatch) {
        result.summary = summaryMatch[0];
    }

    return result;
}


const executeDockerCommand = (sessionId, command) => {
    return new Promise((resolve, reject) => {
        const dockerCommand = `docker exec ${sessionId} ${command}`;
        exec(dockerCommand, (error, stdout, stderr) => {
            if (error) {
                reject({ error: "Failed to execute command", message: error.message, stderr });
            } else {
                resolve(stdout.split('\n'));
            }
        });
    });
};



function execRunParsePY(resultsString) {
    const lines = resultsString.trim().split('\n');
    const results = {};

    lines.forEach(line => {
        const [key, value] = line.split(': ');
        if (key && value) {
            const formattedKey = key.toLowerCase().trim().replace(/\s+/g, '_');
            results[formattedKey] = parseInt(value, 10);
        }
    });

    return results;
}

function execRunParseJava(resultsString) {
    const lines = resultsString.trim().split('\n');
    const results = {};

    lines.forEach((line, index) => {
        const key = `output${index + 1}`;
        results[key] = line.trim();
    });

    return results;
}
function execRunParseCpp(resultsString) {
    const lines = resultsString.trim().split('\n');
    const results = {};

    lines.forEach((line, index) => {
        const key = `output${index + 1}`;
        results[key] = line.trim();
    });

    return results;
}


function execRunParsePhp(resultsString) {
    const lines = resultsString.trim().split('\n');
    const results = {};

    lines.forEach((line, index) => {
        const key = `output${index + 1}`;
        results[key] = line.trim();
    });

    return results;
}


module.exports = { 
    objeto , 
    executeCommandInContainer,
    getCommandsForLanguage,
    listDockerContainers,
    parsePytestResults,
    executeDockerCommand,
    executeCommandInContainer2,
    executeCommandInContainer3,
    parseFailedTestsC,
    executeCommandInContainer4,
    execRunParsePY,
    execRunParseJava,
    execRunParsePhp,
    execRunParseCpp
};


