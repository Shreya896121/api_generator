DROP PROCEDURE IF EXISTS sp_get_persons_names;

DELIMITER $$

CREATE PROCEDURE sp_get_persons_names(
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

    IF p_page IS NULL OR p_page < 1 THEN
        SET p_page = 1;
    END IF;

    IF p_limit IS NULL OR p_limit < 1 THEN
        SET p_limit = 10;
    END IF;

    SET v_offset = (p_page - 1) * p_limit;

    SELECT COUNT(*) INTO p_total
    FROM persons;

    SELECT 
        first_name,
        last_name
    FROM persons
    ORDER BY person_id DESC
    LIMIT p_limit OFFSET v_offset;
END $$

DELIMITER ;
