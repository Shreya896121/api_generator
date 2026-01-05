// ======================
// SIMPLE CLI TOOL TO RUN API FUNCTIONS
// ======================

// Import helper modules
const path = require('path');

// Load environment variables
require('dotenv').config();

// ======================
// PART 1: LOAD THE API FILE
// ======================
function loadApiFile(fileName) {
    try {
        // Try to load the JavaScript file
        const apiFile = require(fileName);
        return apiFile;
    } catch (error) {
        console.log(`Error: Cannot find or load ${fileName}`);
        console.log(`Make sure the file exists in the same folder`);
        return null;
    }
}

// ======================
// PART 2: FIND A FUNCTION IN THE FILE
// ======================
function findFunction(apiFile) {
    // If the file itself is a function, use it
    if (typeof apiFile === 'function') {
        return apiFile;
    }
    
    // If file has a 'default' function, use it
    if (apiFile.default && typeof apiFile.default === 'function') {
        return apiFile.default;
    }
    
    // If file is an object, look for any function inside it
    if (typeof apiFile === 'object') {
        // Get all values from the object
        const allExports = Object.values(apiFile);
        
        // Find the first function
        for (const exportItem of allExports) {
            if (typeof exportItem === 'function') {
                return exportItem;
            }
        }
    }
    
    return null;
}

// ======================
// PART 3: MAIN PROGRAM
// ======================
function main() {
    console.log("=== API Runner Tool ===");
    
    // Get command line arguments
    // Example: node runapi.js getUsers 1 10
    const args = process.argv;
    
    if (args.length < 3) {
        console.log("\nHow to use:");
        console.log("  node runapi.js <api-file-name> [page] [limit]");
        console.log("\nExamples:");
        console.log("  node runapi.js getUsers");
        console.log("  node runapi.js getProducts 2 20");
        process.exit(1);
    }
    
    // Extract arguments
    const apiName = args[2];      // First argument after script name
    const pageStr = args[3];      // Optional page number
    const limitStr = args[4];     // Optional limit
    
    // Build the file path
    const fileName = `${apiName}.js`;
    const filePath = path.join(__dirname,'scripts', fileName);
    
    console.log(`\nLooking for: ${fileName}`);
    console.log(`Full path: ${filePath}`);
    
    // Step 1: Load the API file
    const apiFile = loadApiFile(filePath);
    if (!apiFile) {
        process.exit(1);
    }
    
    // Step 2: Find a function in the file
    const apiFunction = findFunction(apiFile);
    if (!apiFunction) {
        console.log(`\nError: No function found in ${fileName}`);
        console.log("Make sure your file exports a function");
        process.exit(1);
    }
    
    console.log(`\n✓ Found function: ${apiFunction.name || 'anonymous'}`);
    
    // Step 3: Prepare parameters
    let page = 1;
    let limit = 10;
    
    if (pageStr) {
        page = parseInt(pageStr, 10);
        if (isNaN(page)) {
            console.log(`Warning: Page '${pageStr}' is not a number, using default: 1`);
            page = 1;
        }
    }
    
    if (limitStr) {
        limit = parseInt(limitStr, 10);
        if (isNaN(limit)) {
            console.log(`Warning: Limit '${limitStr}' is not a number, using default: 10`);
            limit = 10;
        }
    }
    
    console.log(`\nParameters:`);
    console.log(`  Page: ${page}`);
    console.log(`  Limit: ${limit}`);
    
    // Step 4: Run the function
    console.log("\n" + "=".repeat(50));
    console.log("Running API function...");
    console.log("=".repeat(50));
    
    try {
        // Check if function expects page and limit as separate parameters
        const result = apiFunction(page, limit);
        
        // Handle promises (async functions)
        if (result && typeof result.then === 'function') {
            result.then((data) => {
                console.log("\n✅ Success! Result:");
                console.log(JSON.stringify(data, null, 2));
                process.exit(0);
            }).catch((error) => {
                console.log("\n❌ Error running function:");
                console.log(error.message);
                process.exit(1);
            });
        } else {
            // Function returned immediately (synchronous)
            console.log("\n✅ Success! Result:");
            console.log(JSON.stringify(result, null, 2));
            process.exit(0);
        }
    } catch (error) {
        console.log("\n❌ Error running function:");
        console.log(error.message);
        process.exit(1);
    }
}

// Start the program
main();