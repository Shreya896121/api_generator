DELIMITER $$

-- Stored procedure to list detailed information about tasks
-- Includes task details along with related person and shift information
CREATE PROCEDURE sp_list_task_details(
    IN p_page INT,
    IN p_limit INT,
    OUT p_total INT
)
BEGIN
    DECLARE v_offset INT DEFAULT 0;

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

    SET v_offset = (p_page - 1) * p_limit;

    -- Get total count of tasks
    SELECT COUNT(*) INTO p_total
    FROM tasks;

    -- Select task details with related person and shift information
    SELECT 
        t.task_id,
        t.person_id,
        t.shift_id,
        t.title,
        t.start_date,
        t.end_date,
        p.first_name AS person_first_name,
        p.last_name AS person_last_name,
        p.email AS person_email,
        p.designation AS person_designation,
        s.start_time AS shift_start_time,
        s.end_time AS shift_end_time,
        s.status AS shift_status
    FROM tasks t
    LEFT JOIN persons p ON t.person_id = p.person_id
    LEFT JOIN shifts s ON t.shift_id = s.shift_id
    ORDER BY t.task_id DESC
    LIMIT p_limit OFFSET v_offset;
END$$

DELIMITER ;

