DELIMITER $$
DROP PROCEDURE IF EXISTS `evalua`.`get_absences_count_bim`;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_absences_count_bim`(
	IN p_school_group_id INT,
    IN p_bimester_number INT
)
BEGIN
	DECLARE students_count INT;
    
    DROP TABLE IF EXISTS tmpStudents;
    DROP TABLE IF EXISTS tmpFinal;
    DROP TABLE IF EXISTS tmpEvaluations;
    DROP TABLE IF EXISTS tmpDetails;
    
	CREATE TEMPORARY TABLE tmpFinal (item varchar(100), count int, ratio float);
	CREATE TEMPORARY TABLE tmpStudents (id int);
    CREATE TEMPORARY TABLE tmpEvaluations (id int, student_id int);
    CREATE TEMPORARY TABLE tmpDetails (
		input_value float,
        indicator_id int,
        student_id int
	);
    
	INSERT INTO tmpStudents (id)
	SELECT id 
	FROM students 
	WHERE school_group_id = p_school_group_id;
    
    SET students_count = (SELECT COUNT(*) FROM tmpStudents);

	INSERT INTO tmpEvaluations
	SELECT 
		se.id,
        se.student_id
	FROM student_evaluations se
    WHERE se.student_id IN (SELECT id FROM tmpStudents) 
		AND se.bimester_number = p_bimester_number;
    
    INSERT INTO tmpFinal (item, count, ratio)
    VALUES ('Total alumnos', students_count, 1);

	INSERT INTO tmpDetails (indicator_id, input_value, student_id)
    SELECT indicator_id, input_value, t.student_id
    FROM student_evaluation_details
		JOIN tmpEvaluations t ON 
			student_evaluation_details.student_evaluation_id = t.id
	WHERE indicator_id = 1;
    
    INSERT INTO tmpFinal (item, count, ratio)
    SELECT 'Varias', COUNT(*) / 7,  ( COUNT(input_value)/7 ) / students_count
    FROM tmpDetails
    WHERE input_value > 0;
    
    INSERT INTO tmpFinal (item, count, ratio)
    SELECT 'Un día', COUNT(*) / 7,  ( COUNT(input_value)/7 ) / students_count
    FROM tmpDetails
    WHERE input_value = 1;
    
    INSERT INTO tmpFinal (item, count, ratio)
    SELECT 'Sin falta', COUNT(*) / 7,  ( COUNT(input_value)/7 ) / students_count
    FROM tmpDetails
    WHERE input_value = 0;
        
    SELECT * FROM tmpFinal;
    
    DROP TABLE IF EXISTS tmpStudents;
    DROP TABLE IF EXISTS tmpFinal;
    DROP TABLE IF EXISTS tmpEvaluations;
    DROP TABLE IF EXISTS tmpDetails;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS `evalua`.`get_friendship_score_bim`;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_friendship_score_bim`(
	IN p_school_group_id INT,
        IN p_bimester_number INT
)
BEGIN
    DECLARE students_count INT;
    
    DROP TABLE IF EXISTS tmpStudents;
    DROP TABLE IF EXISTS tmpFinal;
    DROP TABLE IF EXISTS tmpEvaluations;
    DROP TABLE IF EXISTS tmpDetails;
    
    CREATE TEMPORARY TABLE tmpFinal (item varchar(100), count int, ratio float);
    CREATE TEMPORARY TABLE tmpStudents (id int);
    CREATE TEMPORARY TABLE tmpEvaluations (id int);
    CREATE TEMPORARY TABLE tmpDetails (
		input_value float,
        indicator_id int,
        student_id int
	);
    
	INSERT INTO tmpStudents (id)
	SELECT id 
	FROM students 
	WHERE school_group_id = p_school_group_id;
    
    SET students_count = (SELECT COUNT(*) FROM tmpStudents);

    INSERT INTO tmpEvaluations
    SELECT 
            se.id
    FROM student_evaluations se
    WHERE se.student_id IN (SELECT id FROM tmpStudents) 
		AND se.bimester_number = p_bimester_number;
    
    INSERT INTO tmpFinal (item, count, ratio)
    VALUES ('Total alumnos', students_count, 1);

    INSERT INTO tmpDetails (indicator_id, input_value)
    SELECT indicator_id, input_value
    FROM student_evaluation_details
		JOIN tmpEvaluations t ON 
			student_evaluation_details.student_evaluation_id = t.id
	WHERE indicator_id = 6;
    
    INSERT INTO tmpFinal (item, count, ratio)
    SELECT 'Agrede a sus companeros', COUNT(*),  COUNT(input_value) / students_count
    FROM tmpDetails
    WHERE input_value < 60;
    
    
    
    INSERT INTO tmpFinal (item, count, ratio)
    SELECT 'Ocasionalmente', COUNT(*),  COUNT(input_value) / students_count
    FROM tmpDetails
    WHERE input_value >= 60 AND input_value < 90;
    
    
    INSERT INTO tmpFinal (item, count, ratio)
    SELECT 'Nunca', COUNT(*),  COUNT(input_value) / students_count
    FROM tmpDetails
    WHERE input_value >= 90;
    
    SELECT * FROM tmpFinal;
    
    DROP TABLE IF EXISTS tmpStudents;
    DROP TABLE IF EXISTS tmpFinal;
    DROP TABLE IF EXISTS tmpEvaluations;
    DROP TABLE IF EXISTS tmpDetails;
END$$
DELIMITER ;


DELIMITER $$
DROP PROCEDURE IF EXISTS `evalua`.`get_math_score_bim`;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_math_score_bim`(
	IN p_school_group_id INT,
    IN p_bimester_number INT
)
BEGIN
    DECLARE students_count INT;
    
    DROP TABLE IF EXISTS tmpStudents;
    DROP TABLE IF EXISTS tmpFinal;
    DROP TABLE IF EXISTS tmpEvaluations;
    DROP TABLE IF EXISTS tmpDetails;
    
	CREATE TEMPORARY TABLE tmpFinal (item varchar(100), count int, ratio float);
	CREATE TEMPORARY TABLE tmpStudents (id int);
    CREATE TEMPORARY TABLE tmpEvaluations (id int);
    CREATE TEMPORARY TABLE tmpDetails (
		input_value float,
        indicator_id int,
        student_id int
	);
    
	INSERT INTO tmpStudents (id)
	SELECT id 
	FROM students 
	WHERE school_group_id = p_school_group_id;
    
    SET students_count = (SELECT COUNT(*) FROM tmpStudents);

    INSERT INTO tmpEvaluations
    SELECT 
            se.id
    FROM student_evaluations se
    WHERE se.student_id IN (SELECT id FROM tmpStudents) 
		AND se.bimester_number = p_bimester_number;
    
    INSERT INTO tmpFinal (item, count, ratio)
    VALUES ('Total alumnos', students_count, 1);

    INSERT INTO tmpDetails (indicator_id, input_value)
    SELECT indicator_id, input_value
    FROM student_evaluation_details
		JOIN tmpEvaluations t ON 
			student_evaluation_details.student_evaluation_id = t.id
	WHERE indicator_id = 5;
    
    INSERT INTO tmpFinal (item, count, ratio)
    SELECT '5 a 6.9', COUNT(*),  COUNT(input_value) / students_count
    FROM tmpDetails
    WHERE input_value >= 50 AND input_value < 70;
    
    INSERT INTO tmpFinal (item, count, ratio)
    SELECT '7 a 8.9', COUNT(*),  COUNT(input_value) / students_count
    FROM tmpDetails
    WHERE input_value >= 70 AND input_value < 90;
    
    INSERT INTO tmpFinal (item, count, ratio)
    SELECT '9 y 10', COUNT(*),  COUNT(input_value) / students_count
    FROM tmpDetails
    WHERE input_value >= 90;
    
    SELECT * FROM tmpFinal;
    
    DROP TABLE IF EXISTS tmpStudents;
    DROP TABLE IF EXISTS tmpFinal;
    DROP TABLE IF EXISTS tmpEvaluations;
    DROP TABLE IF EXISTS tmpDetails;
END$$
DELIMITER ;


DELIMITER $$
DROP PROCEDURE IF EXISTS `evalua`.`get_participation_score_bim`;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_participation_score_bim`(
	IN p_school_group_id INT,
    IN p_bimester_number INT
)
BEGIN
    DECLARE students_count INT;
    
    DROP TABLE IF EXISTS tmpStudents;
    DROP TABLE IF EXISTS tmpFinal;
    DROP TABLE IF EXISTS tmpEvaluations;
    DROP TABLE IF EXISTS tmpDetails;
    
    CREATE TEMPORARY TABLE tmpFinal (item varchar(100), count int, ratio float);
    CREATE TEMPORARY TABLE tmpStudents (id int);
    CREATE TEMPORARY TABLE tmpEvaluations (id int);
    CREATE TEMPORARY TABLE tmpDetails (
		input_value float,
        indicator_id int,
        student_id int
	);
    
	INSERT INTO tmpStudents (id)
	SELECT id 
	FROM students 
	WHERE school_group_id = p_school_group_id;
    
    SET students_count = (SELECT COUNT(*) FROM tmpStudents);

    INSERT INTO tmpEvaluations
    SELECT 
            se.id
    FROM student_evaluations se
    WHERE se.student_id IN (SELECT id FROM tmpStudents) 
		AND se.bimester_number = p_bimester_number;
    
    INSERT INTO tmpFinal (item, count, ratio)
    VALUES ('Total alumnos', students_count, 1);

    INSERT INTO tmpDetails (indicator_id, input_value)
    SELECT indicator_id, input_value
    FROM student_evaluation_details
		JOIN tmpEvaluations t ON 
			student_evaluation_details.student_evaluation_id = t.id
	WHERE indicator_id = 2;
    
    INSERT INTO tmpFinal (item, count, ratio)
    SELECT 'No participa', COUNT(*) / 7,  ( COUNT(input_value)/7 ) / students_count
    FROM tmpDetails
    WHERE input_value = 0;
    
    INSERT INTO tmpFinal (item, count, ratio)
    SELECT 'Ocasional', COUNT(*) / 7,  ( COUNT(input_value)/7 ) / students_count
    FROM tmpDetails
    WHERE input_value > 0 AND input_value < 100;
    
    INSERT INTO tmpFinal (item, count, ratio)
    SELECT 'Siempre', COUNT(*) / 7,  ( COUNT(input_value)/7 ) / students_count
    FROM tmpDetails
    WHERE input_value = 100;
    
    SELECT * FROM tmpFinal;
    
    DROP TABLE IF EXISTS tmpStudents;
    DROP TABLE IF EXISTS tmpFinal;
    DROP TABLE IF EXISTS tmpEvaluations;
    DROP TABLE IF EXISTS tmpDetails;
END$$
DELIMITER ;


DELIMITER $$
DROP PROCEDURE IF EXISTS `evalua`.`get_performance_score_bim`;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_performance_score_bim`(
	IN p_school_group_id INT,
    IN p_bimester_number INT
)
BEGIN
    DECLARE students_count INT;
    
    DROP TABLE IF EXISTS tmpStudents;
    DROP TABLE IF EXISTS tmpFinal;
    DROP TABLE IF EXISTS tmpEvaluations;
    DROP TABLE IF EXISTS tmpDetails;
    
	CREATE TEMPORARY TABLE tmpFinal (item varchar(100), count int, ratio float);
	CREATE TEMPORARY TABLE tmpStudents (id int);
    CREATE TEMPORARY TABLE tmpEvaluations (id int);
    CREATE TEMPORARY TABLE tmpDetails (
		input_value float,
        indicator_id int,
        student_id int
	);
    
	INSERT INTO tmpStudents (id)
	SELECT id 
	FROM students 
	WHERE school_group_id = p_school_group_id;
    
    SET students_count = (SELECT COUNT(*) FROM tmpStudents);

    INSERT INTO tmpEvaluations
    SELECT 
            se.id
    FROM student_evaluations se
    WHERE se.student_id IN (SELECT id FROM tmpStudents) 
		AND se.bimester_number = p_bimester_number;
    
    INSERT INTO tmpFinal (item, count, ratio)
    VALUES ('Total alumnos', students_count, 1);

    INSERT INTO tmpDetails (indicator_id, input_value)
    SELECT indicator_id, input_value
    FROM student_evaluation_details
		JOIN tmpEvaluations t ON 
			student_evaluation_details.student_evaluation_id = t.id
	WHERE indicator_id = 3;
    
    INSERT INTO tmpFinal (item, count, ratio)
    SELECT '5 a 6.9', COUNT(*) / 7,  ( COUNT(input_value)/7 ) / students_count
    FROM tmpDetails
    WHERE input_value >= 50 AND input_value < 70;
    
    INSERT INTO tmpFinal (item, count, ratio)
    SELECT '7 a 8.9', COUNT(*) / 7,  ( COUNT(input_value)/7 ) / students_count
    FROM tmpDetails
    WHERE input_value >= 70 AND input_value < 90;
    
    INSERT INTO tmpFinal (item, count, ratio)
    SELECT '9 y 10', COUNT(*) / 7,  ( COUNT(input_value)/7 ) / students_count
    FROM tmpDetails
    WHERE input_value >= 90;
    
    SELECT * FROM tmpFinal;
    
    DROP TABLE IF EXISTS tmpStudents;
    DROP TABLE IF EXISTS tmpFinal;
    DROP TABLE IF EXISTS tmpEvaluations;
    DROP TABLE IF EXISTS tmpDetails;
END$$
DELIMITER ;


DELIMITER $$
DROP PROCEDURE IF EXISTS `evalua`.`get_reading_score_bim`;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_reading_score_bim`(
	IN p_school_group_id INT,
    IN p_bimester_number INT
)
BEGIN
    DECLARE students_count INT;
    
    DROP TABLE IF EXISTS tmpStudents;
    DROP TABLE IF EXISTS tmpFinal;
    DROP TABLE IF EXISTS tmpEvaluations;
    DROP TABLE IF EXISTS tmpDetails;
    
    CREATE TEMPORARY TABLE tmpFinal (item varchar(100), count int, ratio float);
    CREATE TEMPORARY TABLE tmpStudents (id int);
    CREATE TEMPORARY TABLE tmpEvaluations (id int);
    CREATE TEMPORARY TABLE tmpDetails (
		input_value float,
        indicator_id int,
        student_id int
	);
    
	INSERT INTO tmpStudents (id)
	SELECT id 
	FROM students 
	WHERE school_group_id = p_school_group_id;
    
    SET students_count = (SELECT COUNT(*) FROM tmpStudents);

    INSERT INTO tmpEvaluations
    SELECT 
            se.id
    FROM student_evaluations se
    WHERE se.student_id IN (SELECT id FROM tmpStudents) 
		AND se.bimester_number = p_bimester_number;
    
    INSERT INTO tmpFinal (item, count, ratio)
    VALUES ('Total alumnos', students_count, 1);

    INSERT INTO tmpDetails (indicator_id, input_value)
    SELECT indicator_id, input_value
    FROM student_evaluation_details
		JOIN tmpEvaluations t ON 
			student_evaluation_details.student_evaluation_id = t.id
	WHERE indicator_id = 4;
    
    INSERT INTO tmpFinal (item, count, ratio)
    SELECT 'Baja', COUNT(*),  COUNT(input_value) / students_count
    FROM tmpDetails
    WHERE input_value < 60;
    
    INSERT INTO tmpFinal (item, count, ratio)
    SELECT 'Regular', COUNT(*),  COUNT(input_value) / students_count
    FROM tmpDetails
    WHERE input_value >= 60 AND input_value < 90;
    
    INSERT INTO tmpFinal (item, count, ratio)
    SELECT 'Buena', COUNT(*),  COUNT(input_value) / students_count
    FROM tmpDetails
    WHERE input_value >= 90;
    
    SELECT * FROM tmpFinal;
    
    DROP TABLE IF EXISTS tmpStudents;
    DROP TABLE IF EXISTS tmpFinal;
    DROP TABLE IF EXISTS tmpEvaluations;
    DROP TABLE IF EXISTS tmpDetails;
END$$
DELIMITER ;
