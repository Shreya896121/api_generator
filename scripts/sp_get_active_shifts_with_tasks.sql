DELIMITER $$

CREATE PROCEDURE sp_get_active_shifts_with_tasks(
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

    -- Get total count of active shifts
    SELECT COUNT(*) INTO p_total
    FROM shifts
    WHERE status = 'active';

    -- Return paginated list of active shifts with their tasks as JSON array
    SELECT 
        s.shift_id,
        s.start_time,
        s.end_time,
        s.status,
        COALESCE(
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'task_id', t.task_id,
                    'person_id', t.person_id,
                    'title', t.title,
                    'start_date', t.start_date,
                    'end_date', t.end_date
                )
            ),
            JSON_ARRAY()
        ) AS tasks
    FROM shifts s
    LEFT JOIN tasks t ON s.shift_id = t.shift_id
    WHERE s.status = 'active'
    GROUP BY s.shift_id, s.start_time, s.end_time, s.status
    ORDER BY s.shift_id DESC
    LIMIT p_limit OFFSET v_offset;
END$$

DELIMITER ;

