erDiagram
    persons ||--o{ tasks : has
    shifts ||--o{ tasks : has

    persons {
        int person_id PK 
        varchar(100) first_name 
        varchar(100) last_name 
        varchar(150) email 
        varchar(100) designation
    }

    tasks {
        int task_id PK 
        int person_id FK 
        int shift_id FK
        varchar(200) title 
        datetime start_date 
        datetime end_date 
    }

    shifts{
        int shift_id PK
        datetime start_time 
        datetime end_time
        varchar(50) status
    }