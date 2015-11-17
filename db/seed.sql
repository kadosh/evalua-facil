-- MySQL dump 10.13  Distrib 5.6.26, for Win64 (x86_64)
--
-- Host: localhost    Database: evalua_template
-- ------------------------------------------------------
-- Server version	5.6.26-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `access_tokens`
--

LOCK TABLES `access_tokens` WRITE;
/*!40000 ALTER TABLE `access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `allocations`
--

LOCK TABLES `allocations` WRITE;
/*!40000 ALTER TABLE `allocations` DISABLE KEYS */;
/*!40000 ALTER TABLE `allocations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `alt_student_evaluation_details`
--

LOCK TABLES `alt_student_evaluation_details` WRITE;
/*!40000 ALTER TABLE `alt_student_evaluation_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `alt_student_evaluation_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `alt_student_evaluations`
--

LOCK TABLES `alt_student_evaluations` WRITE;
/*!40000 ALTER TABLE `alt_student_evaluations` DISABLE KEYS */;
/*!40000 ALTER TABLE `alt_student_evaluations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `bimesters`
--

LOCK TABLES `bimesters` WRITE;
/*!40000 ALTER TABLE `bimesters` DISABLE KEYS */;
INSERT INTO `bimesters` VALUES (1,1,1438387200,1446249600),(2,2,1446336000,1450569600),(3,3,1451606400,1456617600),(4,4,1456790400,1461974400),(5,5,1462060800,1467763200);
/*!40000 ALTER TABLE `bimesters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,'webclient','password',0,1,3600),(2,'androidapp','password',1,1,3600);
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `evaluations`
--

LOCK TABLES `evaluations` WRITE;
/*!40000 ALTER TABLE `evaluations` DISABLE KEYS */;
/*!40000 ALTER TABLE `evaluations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `faculty_members`
--

LOCK TABLES `faculty_members` WRITE;
/*!40000 ALTER TABLE `faculty_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `faculty_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `grades`
--

LOCK TABLES `grades` WRITE;
/*!40000 ALTER TABLE `grades` DISABLE KEYS */;
INSERT INTO `grades` VALUES (7,7,'1° Secundaria'),(8,8,'2° Secundaria'),(9,9,'3° Secundaria');
/*!40000 ALTER TABLE `grades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `indicators`
--

LOCK TABLES `indicators` WRITE;
/*!40000 ALTER TABLE `indicators` DISABLE KEYS */;
INSERT INTO `indicators` VALUES (1,'Asistencia'),(2,'Participación'),(3,'Desempeño'),(4,'Comprensión Lectora'),(5,'Comprensión Matemática'),(6,'Convivencia Escolar');
/*!40000 ALTER TABLE `indicators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'director'),(2,'teacher');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `school_groups`
--

LOCK TABLES `school_groups` WRITE;
/*!40000 ALTER TABLE `school_groups` DISABLE KEYS */;
INSERT INTO `school_groups` VALUES (25,7,'A',0),(26,7,'B',0),(27,7,'C',0),(28,7,'D',0),(29,8,'A',0),(30,8,'B',0),(31,8,'C',0),(32,8,'D',0),(33,9,'A',0),(34,9,'B',0),(35,9,'C',0),(36,9,'D',0);
/*!40000 ALTER TABLE `school_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `student_evaluation_details`
--

LOCK TABLES `student_evaluation_details` WRITE;
/*!40000 ALTER TABLE `student_evaluation_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_evaluation_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `student_evaluations`
--

LOCK TABLES `student_evaluations` WRITE;
/*!40000 ALTER TABLE `student_evaluations` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_evaluations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (43,'ESP','Español',7),(44,'MAT','Matemáticas',7),(45,'HIS','Historia',7),(46,'ING','Inglés',7),(47,'FCE','Formación Cívica y Ética',7),(48,'ART','Artes',7),(49,'TEC','Tecnologías',7),(50,'ESP','Español',8),(51,'MAT','Matemáticas',8),(52,'HIS','Historia',8),(53,'ING','Inglés',8),(54,'FCE','Formación Cívica y Ética',8),(55,'ART','Artes',8),(56,'TEC','Tecnologías',8),(57,'ESP','Español',9),(58,'MAT','Matemáticas',9),(59,'HIS','Historia',9),(60,'ING','Inglés',9),(61,'FCE','Formación Cívica y Ética',9),(62,'ART','Artes',9),(63,'TEC','Tecnologías',9);
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'master','$2a$10$Af/zq0zcfx5GcsdQAX/qbeqaZmP8WHHZslBTexTs6c.PC8nu3Ql0.',1,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-11-14 21:23:05
