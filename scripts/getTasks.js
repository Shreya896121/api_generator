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
         type: Sequelize.QueryTypes.SELECT 
        });
        const totalCountResult = results[0] || [];
        const total = totalCountResult.length > 0 ? totalCountResult[0].total_count : 0;
        const tasksData = results[1] || [];
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