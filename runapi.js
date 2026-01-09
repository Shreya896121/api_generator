const path = require("path");

const [, , fileName, page, size] = process.argv;

async function run() {
  if (!fileName) {
    return console.error(
      "Usage: node run.js <filename> <pageNumber> <pageSize>"
    );
  }

  try {
    const scriptPath = `./scripts/${fileName}.js`;
    const module = require(scriptPath);

    const [functionName] = Object.keys(module);
    const executeTask = module[functionName];

    console.log(
      `Executing: ${functionName} | Page: ${page || 1} | Size: ${size || 10}`
    );

    const response = await executeTask({
      PageNumber: page,
      PageSize: size,
    });

    console.dir(response, { depth: null, colors: true });
  } catch (err) {
    console.error("Error running script:", err.message);
  } finally {
    process.exit();
  }
}

run();

// node run.js getTasks 1 5
// npm run start -- getTasks 2 10