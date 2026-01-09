const Sequelize = require('sequelize');
const sfContext= require('../config/connection');

async function getTasks(requestBody,queryParams=null) {
    try {
    const params = (queryParams && Object.keys(queryParams).length > 0) ? queryParams : requestBody || {};
    const PageNumber = parseInt(params.PageNumber, 10) || 1;
    const PageSize = parseInt(params.PageSize, 10) || 10;
    
    const replacements={PageNumber, PageSize };

    const results = await sfContext.query(
        `EXEC sp_get_tasks 
        @PageNumber = :PageNumber, 
        @PageSize = :PageSize`,
        { replacements, 
        type: Sequelize.QueryTypes.RAW 
    }
);

// Debug: Check what results look like
console.log('First few results:', results.slice(0, 3));

// For RAW queries, results is an array of arrays
// The first array contains the first result set
// The second array contains the second result set

let total = 0;
let tasksData = [];

if (Array.isArray(results)) {
    if (results.length >= 1) {
        // First result set: total count
        const totalSet = results[0];
        if (totalSet && totalSet.length > 0 && totalSet[0].total_count !== undefined) {
            total = totalSet[0].total_count;
        }
    }
    
    if (results.length >= 2) {
        // Second result set: tasks data
        tasksData = results[1] || [];
    }
}

// Alternative: If results is a flat array
if (results && results.length > 0 && results[0] && results[0].total_count !== undefined) {
    // It's returning both sets mixed together
    // Find the total_count row
    const totalRow = results.find(row => row.total_count !== undefined);
    if (totalRow) {
        total = totalRow.total_count;
        // Filter out the total row from tasks
        tasksData = results.filter(row => row.task_id !== undefined);
    } else {
        tasksData = results;
    }
}

        return {
            success: true,
            data: {
                tasks: tasksData,
                pagination: {
                    page: PageNumber,
                    limit: PageSize,
                    total: total,
                    totalPages: Math.ceil(total / PageSize)
                }
            },
            error: null
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.message
        };
    }
}

module.exports = { getTasks };