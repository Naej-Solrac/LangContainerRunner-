const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
import { log } from 'console';
import exect_service from './exect_service';
const router = express.Router();
router.use(express.json());

const execAsync = promisify(exec); // Promisify para usar async/await con exec

const containerSessions = {};

router.post('/runcode', async (req, res) => {
    try {
        let { language, code, sessionId, testCode } = req.body;

        if (!sessionId) {
            sessionId = uuidv4();
        }
        console.log(`UUID for this session: ${sessionId}`);

        let containerName = `code-${sessionId}`;

        const basePath = path.join(__dirname, sessionId);
        const langConfig = exect_service.objeto(language);

        if (!langConfig) {
            return res.status(400).send({ error: "Language not supported" });
        }

        const codePath = path.join(basePath, `code${langConfig.fileExtension}`);
        const testPath = path.join(basePath, `test_code${langConfig.fileExtension}`);

        if (!fs.existsSync(basePath)) {
            fs.mkdirSync(basePath, { recursive: true });
        }
        
        fs.writeFileSync(codePath, code);
        fs.writeFileSync(testPath, testCode);

        let startContainerCommand = `docker run -d --name ${containerName} --memory=512m --cpus=1.0 -v ${basePath}:/app ${langConfig.dockerImage} tail -f /dev/null`;

        // Asignación de containerName a containerSessions debería ser después de definir containerName

        const containersList = await exect_service.listDockerContainers();

        if (!containersList.includes(containerName)) {
            console.log("container exist");
            await execAsync(startContainerCommand);
            console.log("Container started: ", containerName);
        }

        let commands = exect_service.getCommandsForLanguage(language);
        
        console.log(commands);
        if (!commands) {
            return res.status(400).send({ error: "Commands for language not found" + commands});
        }
        
        // Ejecutar el comando principal y obtener siempre su resultado.
        const execRun = await exect_service.executeCommandInContainer(containerName, commands.compileAndRun);

       let execRunParsed;
        switch (language) {
            case 'Python':
                execRunParsed = exect_service.execRunParsePY(execRun);
                break;
            case 'Java':
                execRunParsed = exect_service.execRunParseJava(execRun);
                break;
            case 'Cpp':
                execRunParsed = exect_service.execRunParseCpp(execRun);
                break;
            case 'Php':
                execRunParsed = exect_service.execRunParsePhp(execRun);
                break;
            default:
                throw new Error('Unsupported language: ' + language);
        }


        let response = {
            execRun: execRunParsed
        };

        // Según el lenguaje, ejecutar un comando secundario.
        if (language === "Python") {
            const execTest = await exect_service.executeCommandInContainer(containerName, commands.compileAndTest);
            const result = await exect_service.parsePytestResults(execTest);
            response.execTest = result;
        } else if (language === 'Java') {
            const execTest = await exect_service.executeCommandInContainer2(containerName, commands.compileAndTest);
            response.execTest = execTest;
        } else if (language === 'Cpp') {
            const execTest = await exect_service.executeCommandInContainer3(containerName, commands.compileAndTest);
            response.execTest = execTest;
        } else if (language === 'Php') {
            const execTest = await exect_service.executeCommandInContainer4(containerName, commands.compileAndTest);
            response.execTest = execTest;
        }

        res.json(response);

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to execute command", message: error.message });
    }
});



router.post('/JustRunCode', async (req, res) => {
    try {
        let { sessionId, language, code, testCode } = req.body;

        // Si no se proporciona sessionId, generamos uno nuevo
        if (!sessionId) {
            sessionId = uuidv4();
            console.log(`UUID for this session: ${sessionId}`);
        }

        const basePath = path.join(__dirname, sessionId);
        const langConfig = exect_service.objeto(language);

        if (!langConfig) {
            return res.status(400).send({ error: "Language not supported" });
        }

        const codePath = path.join(basePath, `code${langConfig.fileExtension}`);
        const testPath = path.join(basePath, `test_code${langConfig.fileExtension}`);

        if (!fs.existsSync(basePath)) {
            fs.mkdirSync(basePath, { recursive: true });
        }

        fs.writeFileSync(codePath, code);
        fs.writeFileSync(testPath, testCode);

        let containerName = `code-${sessionId}`;
        let startContainerCommand = `docker run -d --name ${containerName} --memory=512m --cpus=1.0 -v ${basePath}:/app ${langConfig.dockerImage} tail -f /dev/null`;
        let nameToFind = `code-${sessionId}`;

        // Asignación de containerName a containerSessions debería ser después de definir containerName
        containerSessions[sessionId] = containerName;

        const containersList = await exect_service.listDockerContainers();

        let execRunResult, execTestResult;

        if (!containersList.includes(nameToFind)) {
            console.log("llegaaaaaaa");
            await execAsync(startContainerCommand);
            console.log("Container started: ", containerName);
        }

        let commands = exect_service.getCommandsForLanguage(language);
        console.log(commands);
        if (!commands) {
            return res.status(400).send({ error: "Commands for language not found" + commands});
        }

        try {
            execRunResult = await exect_service.executeCommandInContainer(containerName, commands.compileAndRun);
        } catch (runError) {
            console.error("Run command failed: ", runError);
            execRunResult = null;
        }

        try {
            execTestResult = await exect_service.executeCommandInContainer(containerName, commands.compileAndTest);
        } catch (testError) {
            console.error("Test command failed: ", testError);
            execTestResult = null;
        }

        return res.json({
            execRunResult: {
                data: execRunResult ? [execRunResult] : [],
                error: null
            },
            execTestResult: {
                data: execTestResult ? [execTestResult] : [],
                error: execTestResult ? null : "Failed to execute test command"
            }
        });

    } catch (error) {
        console.error("Unexpected error: ", error);
        res.status(500).send({ error: "Failed to execute command", message: error.message });
    }
});



router.post('/Terminal', async (req, res) => {
    try {
        let { sessionId, command } = req.body;
        sessionId = `code-${sessionId}`;
        console.log("sessionId: ----->");
        console.log(sessionId);
        // Comprobar si el contenedor existe
        exec(`docker inspect ${sessionId}`, (inspectError, inspectStdout, inspectStderr) => {
            if (inspectError) {
                console.error(`Inspect error: ${inspectError}`);
                return res.status(404).send({
                    error: "Container does not exist",
                    message: inspectError.message,
                    stderr: inspectStderr
                });
            }

            // Ejecutar el comando si el contenedor existe
            const dockerCommand = `docker exec ${sessionId} ${command}`;
            exec(dockerCommand, (execError, stdout, stderr) => {
                if (execError) {
                    console.error(`Exec error: ${execError}`);
                    return res.status(500).send({
                        error: "Failed to execute command",
                        message: execError.message,
                        stderr
                    });
                }
                const outputLines = stdout.split('\n');
                res.json({ output: outputLines });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            error: "Failed to handle request",
            message: error.message
        });
    }
});

router.post('/endSession', async (req, res) => {
    // const containerId  = req.body.containerId; // Cambio de req.query a req.body
    const containerId  = "code-68755465-8c55-47c5-bd02-e2c857d636e4"
    console.log(containerId);
    exec(`docker stop ${containerId} && docker rm ${containerId}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send({ error: "Failed to terminate session" });
        }
        res.send({ message: "Session terminated successfully", output: stdout });
    });
});


module.exports = router;

export default router;