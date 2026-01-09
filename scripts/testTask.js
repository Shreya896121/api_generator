const { getTasks } = require('../scripts/getTasks');

async function run() {
    const body = {
        PageNumber: 1,
        PageSize: 2
    };

    const result = await getTasks(body);

    console.log(JSON.stringify(result, null, 2));
}

run();
