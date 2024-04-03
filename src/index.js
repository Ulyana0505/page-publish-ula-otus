/*
https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
https://github.com/settings/tokens
git push https://<TOKEN>@github.com/<username>/<repository>.git

--project=project.json
--dir=/path/to/project
--login=<username>
--token=<TOKEN>
--build -b
--push  -p

node src/index.js --project=./src/project.json
node src/index.js -p --dir=/path/to/project --login=jijio --token=lkjoh -bp
*/

const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

const {readFile} = require("fs/promises");

const {spawnSync} = require("child_process");


/**
 * @typedef {Object} Command
 * @property {string} cmd
 * @property {string[]} args
 */

/**
 * @typedef {Object} Config
 * @property {string} project
 * @property {string} dir
 * @property {boolean|null} build
 * @property {boolean|null} push
 * @property {string} login
 * @property {string} token
 * @property {string} repo
 */

/** @type {Config} */
const params = {
    dir: "",
    build: null,
    push: null,
    login: "",
    token: "",
    repo: ""
}

/**
 * @returns {Config}
 */
function getArgs() {
    return process.argv.reduce((args, arg) => {
        if (arg.slice(0, 2) === "--") {
            const longArg = arg.split("=");
            const longArgFlag = longArg[0].slice(2);
            const longArgValue = longArg.length > 1 ? longArg[1] : true;
            args[longArgFlag] = longArgValue;
        } else if (arg[0] === "-") {
            const flags = arg.slice(1).split("");
            flags.forEach((flag) => {
                args[flag] = true;
            });
        }
        return args;
    }, {});
}

/**
 * @returns {Config}
 */
async function json(path) {
    try {
        return JSON.parse(await readFile(path, "utf8"));
    } catch (e) {
        console.error(e);
    }
}

/**
 * @param {string} questionText
 * @returns {Promise<string>}
 */
function ask(questionText) {
    return new Promise((resolve) => {
        readline.question(questionText, (input) => resolve(input.trim()));
    });
}

/**
 * @returns {Config}
 */
async function getParams() {
    const args = getArgs();

    if (args.project) {
        const data = await json(args.project);
        if (data) {
            params.dir = data.dir;
            params.login = data.login;
            params.token = data.token;
            params.repo = data.repo;
            if (typeof data.build == "boolean") {
                params.build = data.build;
            }
            if (typeof data.push == "boolean") {
                params.push = data.push;
            }
        }
    }

    if (args.dir) {
        params.dir = args.dir;
    }
    if (args.login) {
        params.login = args.login;
    }
    if (args.token) {
        params.token = args.token;
    }

    if (args.build === true || args.b === true) {
        params.build = Boolean(args.build) || Boolean(args.b);
    }
    if (args.push === true || args.p === true) {
        params.push = Boolean(args.push) || Boolean(args.p);
    }

    // ===

    if (!params.dir) {
        params.dir = await ask("Введите путь к проекту: ")
    }

    if (params.build === null) {
        params.build = ["д", "y"].includes((await ask("Будем собирать? [д/н y/n]:")).toLowerCase());
    }
    if (params.push === null) {
        params.push = ["д", "y"].includes((await ask("Будем отправлять? [д/н y/n]:")).toLowerCase());
    }

    return params;
}

async function start() {
    const params = await getParams();

    if (params.dir) {
        /** @type {Command[]} */
        const commands = [];
        if (params.build) {
            commands.push({cmd: "npm", args: ["run", "build"]});
        }
        if (params.push && params.repo && params.login && params.token) {
            commands.push({
                cmd: "git",
                args: ["push", `https://${params.token}@github.com/${params.login}/${params.repo}.git`]
            });
        }

        for (const {cmd, args} of commands) {
            const result = spawnSync(cmd, args, {cwd: params.dir, encoding: "utf-8"});
            if (result.status) {
                console.error("Ошибка при", cmd);
                console.error(">>", result.stderr);
                break;
            }
        }
    } else {
        console.log("Директория (dir) не указана");
    }

    process.exit();
}


start();
