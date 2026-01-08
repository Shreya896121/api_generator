CREATE PROCEDURE sp_get_tasks
    @PageNumber INT = 1,
    @PageSize INT = 10
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT;
    DECLARE @Total INT;

    IF @PageNumber IS NULL OR @PageNumber < 1
        SET @PageNumber = 1;
    
    IF @PageSize IS NULL OR @PageSize < 1
        SET @PageSize = 10;
    
    SET @Offset = (@PageNumber - 1) * @PageSize;

    SELECT @Total = COUNT(*) FROM tasks;
    
    SELECT @Total AS total_count;

    SELECT 
        task_id,
        person_id,
        title,
        start_date,
        end_date
    FROM tasks
    ORDER BY task_id 
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END