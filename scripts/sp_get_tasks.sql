DELIMITER $$

CREATE PROCEDURE sp_get_tasks(
    IN p_page INT,
    IN p_limit INT,
    OUT p_total INT
)
BEGIN
    DECLARE v_offset INT DEFAULT 0;

    -- Error handler for SQL exceptions
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    -- Basic parameter validation
    IF p_page IS NULL OR p_page < 1 THEN
        SET p_page = 1;
    END IF;

    IF p_limit IS NULL OR p_limit < 1 THEN
        SET p_limit = 10;
    END IF;

    -- Calculate offset for pagination
    SET v_offset = (p_page - 1) * p_limit;

    -- Get total count of tasks
    SELECT COUNT(*) INTO p_total
    FROM tasks;

    -- Return paginated list of tasks
    SELECT 
        task_id,
        person_id,
        title,
        start_date,
        end_date
    FROM tasks
    ORDER BY task_id DESC
    LIMIT p_limit OFFSET v_offset;
END$$

DELIMITER ;


