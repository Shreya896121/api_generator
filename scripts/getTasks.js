const Sequelize = require('sequelize');
const sfContext = require('../config/connection');
const logger = require('../logger');

async function getTasks(queryParams = null, requestBody = null) {
    logger.info('getTasks', "Starting to execute getTasks");
    try {
        logger.info('getTasks', 'requestBody=%j', requestBody);
        logger.info('getTasks', 'queryParams=%j', queryParams);

        const params = (queryParams && Object.keys(queryParams).length > 0) ? queryParams : requestBody || {};
        const PageNumber = parseInt(params.PageNumber, 10) || 1;
        const PageSize = parseInt(params.PageSize, 10) || 2;

        logger.info('getTasks', `Pagination -> PageNumber=${PageNumber}, PageSize=${PageSize}`);

        const replacements = { PageNumber, PageSize };

        logger.info('getTasks', 'Executing stored procedure sp_get_tasks');

        const results = await sfContext.query(
            `EXEC sp_get_tasks 
        @PageNumber = :PageNumber, 
        @PageSize = :PageSize`,
            {
                replacements,
                type: Sequelize.QueryTypes.SELECT
            }
        );

        logger.info('getTasks', `DB query completed. Rows returned: ${results.length}`);
        logger.info('getTasks', 'Raw results: %j', results);


        const total =
            results.length > 0 && results[0].total_count !== undefined
                ? results[0].total_count
                : 0;

        logger.info('getTasks', `Total count: ${total}`);

        if (total > 0) {
            const tasks = results.filter(row => row.task_id !== undefined);
            logger.info('getTasks', `Returning ${tasks.length} tasks`);

            return {
                success: true,
                data: {
                    tasks,
                    pagination: {
                        page: PageNumber,
                        limit: PageSize,
                        total,
                        totalPages: Math.ceil(total / PageSize)
                    }
                },
                error: null
            };
        }

        logger.warn('getTasks', 'No data found');
        // No data case
        return {
            success: true,
            data: {
                tasks: [],
                pagination: {
                    page: PageNumber,
                    limit: PageSize,
                    total: 0,
                    totalPages: 0
                }
            },
            error: null
        };

    } catch (error) {
        logger.error('getTasks', 'Error: %s', error.message);
        return {
            success: false,
            data: null,
            error: error.message
        };
    }
}

module.exports = { getTasks };