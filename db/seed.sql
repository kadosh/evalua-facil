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
INSERT INTO `grades` VALUES (1,1,'1° Primaria'),(2,2,'2° Primaria'),(3,3,'3° Primaria'),(4,4,'4° Primaria'),(5,5,'5° Primaria'),(6,6,'6° Primaria');
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
INSERT INTO `school_groups` VALUES (1,1,'A',0),(2,1,'B',0),(3,1,'C',0),(4,1,'D',0),(5,2,'A',0),(6,2,'B',0),(7,2,'C',0),(8,2,'D',0),(9,3,'A',0),(10,3,'B',0),(11,3,'C',0),(12,3,'D',0),(13,4,'A',0),(14,4,'B',0),(15,4,'C',0),(16,4,'D',0),(17,5,'A',0),(18,5,'B',0),(19,5,'C',0),(20,5,'D',0),(21,6,'A',0),(22,6,'B',0),(23,6,'C',0),(24,6,'D',0);
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
INSERT INTO `subjects` VALUES (1,'ESP','Español',1),(2,'MAT','Matemáticas',1),(3,'HIS','Historia',1),(4,'ING','Inglés',1),(5,'FCE','Formación Cívica y Ética',1),(6,'ART','Artes',1),(7,'TEC','Tecnologías',1),(8,'ESP','Español',2),(9,'MAT','Matemáticas',2),(10,'HIS','Historia',2),(11,'ING','Inglés',2),(12,'FCE','Formación Cívica y Ética',2),(13,'ART','Artes',2),(14,'TEC','Tecnologías',2),(15,'ESP','Español',3),(16,'MAT','Matemáticas',3),(17,'HIS','Historia',3),(18,'ING','Inglés',3),(19,'FCE','Formación Cívica y Ética',3),(20,'ART','Artes',3),(21,'TEC','Tecnologías',3),(22,'ESP','Español',4),(23,'MAT','Matemáticas',4),(24,'HIS','Historia',4),(25,'ING','Inglés',4),(26,'FCE','Formación Cívica y Ética',4),(27,'ART','Artes',4),(28,'TEC','Tecnologías',4),(29,'ESP','Español',5),(30,'MAT','Matemáticas',5),(31,'HIS','Historia',5),(32,'ING','Inglés',5),(33,'FCE','Formación Cívica y Ética',5),(34,'ART','Artes',5),(35,'TEC','Tecnologías',5),(36,'ESP','Español',6),(37,'MAT','Matemáticas',6),(38,'HIS','Historia',6),(39,'ING','Inglés',6),(40,'FCE','Formación Cívica y Ética',6),(41,'ART','Artes',6),(42,'TEC','Tecnologías',6);
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'master','$10$Af/zq0zcfx5GcsdQAX/qbeqaZmP8WHHZslBTexTs6c.PC8nu3Ql0.',1,0),(2,'test','$10$Af/zq0zcfx5GcsdQAX/qbeqaZmP8WHHZslBTexTs6c.PC8nu3Ql0.',2,0);
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

-- Dump completed on 2015-11-07 23:00:21
