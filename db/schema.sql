-- MySQL dump 10.13  Distrib 5.6.26, for Win64 (x86_64)
--
-- Host: localhost    Database: evalua
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
-- Table structure for table `access_tokens`
--

DROP TABLE IF EXISTS `access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `access_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(256) NOT NULL,
  `client_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `issued_timestamp` int(11) NOT NULL,
  `expires_timestamp` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `access_tokens_users_idx` (`user_id`),
  KEY `access_tokens_clients_idx` (`client_id`),
  CONSTRAINT `access_tokens_clients` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `access_tokens_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_tokens`
--

LOCK TABLES `access_tokens` WRITE;
/*!40000 ALTER TABLE `access_tokens` DISABLE KEYS */;
INSERT INTO `access_tokens` VALUES (11,'0fa719895a267b183320667d0c5b98b55b5d6084',1,88,1442877310,1442880910),(12,'6f317bb98728da9c216f664763c4e4c7bd8471f6',1,88,1442208519,1442212119),(13,'c476b74d74b201f5b69fc5d3e5b578140ef27d5d',1,88,1442248099,1442251699),(14,'ebfe5db30ceb7f9abca40863603ca446cef558ec',1,88,1442248131,1442251731),(15,'cbd7ffed825b39ef64b53ee893aac7d34401ec86',1,88,1442248148,1442251748),(18,'a5afec9976678af0e6506c044d216c085b144262',1,88,1442638128,1442641728),(19,'373ff5f1c5e52514c3cf3f86a0eaa49351fdddee',1,88,1442801864,1442805464),(20,'525cc7d828fc2c49e007f1fb74ebb70e9c2ab309',1,88,1442803573,1442807173),(21,'fc32d202b21804b6348ee80a4a34208bf85f4e88',1,88,1442803659,1442807259),(22,'87a3f90a714e1fd5e4810935df7a71bd93c1fe9a',1,88,1442874526,1442878126),(23,'1fabde99753a7980a68bdeee8f2da64db03da4ae',1,88,1442876813,1442880413),(24,'81fe4447de5982500f77740ac63b15a8145b35f8',1,88,1442877150,1442880750);
/*!40000 ALTER TABLE `access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `allocations`
--

DROP TABLE IF EXISTS `allocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `allocations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_group_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `faculty_member_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `allocations_school_groups_idx` (`school_group_id`),
  KEY `allocations_subjects_idx` (`subject_id`),
  KEY `allocations_teachers_idx` (`faculty_member_id`),
  CONSTRAINT `allocations_faculty_members` FOREIGN KEY (`faculty_member_id`) REFERENCES `faculty_members` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `allocations_school_groups` FOREIGN KEY (`school_group_id`) REFERENCES `school_groups` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `allocations_subjects` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allocations`
--

LOCK TABLES `allocations` WRITE;
/*!40000 ALTER TABLE `allocations` DISABLE KEYS */;
INSERT INTO `allocations` VALUES (4,1,1,57);
/*!40000 ALTER TABLE `allocations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alt_revision_details`
--

DROP TABLE IF EXISTS `alt_revision_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alt_revision_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `revision_id` int(11) NOT NULL,
  `indicator_id` int(11) NOT NULL,
  `input_value` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `revision_details_indicators_idx` (`indicator_id`),
  KEY `alt_revision_details_revisions_idx` (`revision_id`),
  CONSTRAINT `alt_revision_details_indicators` FOREIGN KEY (`indicator_id`) REFERENCES `indicators` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `alt_revision_details_revisions` FOREIGN KEY (`revision_id`) REFERENCES `alt_revisions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alt_revision_details`
--

LOCK TABLES `alt_revision_details` WRITE;
/*!40000 ALTER TABLE `alt_revision_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `alt_revision_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alt_revisions`
--

DROP TABLE IF EXISTS `alt_revisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alt_revisions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_date` int(11) NOT NULL,
  `origin_platform` varchar(20) NOT NULL DEFAULT 'web-app',
  `is_finished` tinyint(4) NOT NULL DEFAULT '0',
  `finished_date` int(11) NOT NULL,
  `last_change_date` int(11) NOT NULL,
  `allocation_id` int(11) NOT NULL,
  `bimester_number` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `revisions_allocations_idx` (`allocation_id`),
  KEY `alt_revisions_bimesters_idx` (`bimester_number`),
  CONSTRAINT `alt_revisions_bimesters` FOREIGN KEY (`bimester_number`) REFERENCES `bimesters` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `revisions_allocations0` FOREIGN KEY (`allocation_id`) REFERENCES `allocations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alt_revisions`
--

LOCK TABLES `alt_revisions` WRITE;
/*!40000 ALTER TABLE `alt_revisions` DISABLE KEYS */;
/*!40000 ALTER TABLE `alt_revisions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bimesters`
--

DROP TABLE IF EXISTS `bimesters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bimesters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bimester_number` int(11) NOT NULL,
  `start_timestamp` int(11) NOT NULL,
  `end_timestamp` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bimesters`
--

LOCK TABLES `bimesters` WRITE;
/*!40000 ALTER TABLE `bimesters` DISABLE KEYS */;
INSERT INTO `bimesters` VALUES (1,1,1442275200,1442880000);
/*!40000 ALTER TABLE `bimesters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` varchar(256) NOT NULL,
  `client_secret` varchar(300) NOT NULL,
  `app_type` int(11) NOT NULL,
  `is_active` int(11) NOT NULL,
  `refresh_token_life` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,'webclient','password',0,1,3600);
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faculty_members`
--

DROP TABLE IF EXISTS `faculty_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `faculty_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `title` varchar(45) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `contact_number` varchar(10) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `faculty_members_users_idx` (`user_id`),
  CONSTRAINT `faculty_members_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculty_members`
--

LOCK TABLES `faculty_members` WRITE;
/*!40000 ALTER TABLE `faculty_members` DISABLE KEYS */;
INSERT INTO `faculty_members` VALUES (1,'alex','ocampo','Sr','dummy@asd.com',NULL,4),(2,'alex','ocampo','Sr','dummy@asd.com',NULL,5),(3,'alex','ocampo','Sr','dummy@asd.com',NULL,6),(4,'alex','ocampo','Sr','dummy@asd.com',NULL,7),(5,'alex','ocampo','Sr','dummy@asd.com',NULL,8),(6,'alex','ocampo','Sr','dummy@asd.com',NULL,9),(7,'alex','ocampo','Sr','dummy@asd.com',NULL,11),(8,'alex','ocampo','Sr','dummy@asd.com',NULL,12),(9,'alex','ocampo','Sr','dummy@asd.com',NULL,13),(10,'alex','ocampo','Sr','dummy',NULL,14),(11,'alex','ocampo','Sr','dummy',NULL,15),(12,'alex','ocampo','Sr','dummy',NULL,16),(13,'alex','ocampo','Sr','dummy',NULL,17),(14,'alex','ocampo','Sr','dummy',NULL,18),(15,'alex','ocampo','Sr','dummy',NULL,19),(16,'alex','ocampo','Sr','dummy',NULL,20),(17,'alex','ocampo','Sr','dummy',NULL,21),(18,'alex','ocampo','Sr','dummy',NULL,22),(19,'alex','ocampo','Sr','dummy',NULL,23),(20,'alex','ocampo','Sr','dummy',NULL,24),(21,'alex','ocampo','Sr','dummy',NULL,25),(38,'aelx','sadasd','Sr','dummy@sadsf.com',NULL,69),(39,'aelx','sadasd','Sr','dummy@sadsf.com',NULL,70),(40,'aelx','sadasd','Sr','dummy@sadsf.com',NULL,71),(41,'aelx','sadasd','Sr','dummy@sadsf.com',NULL,72),(53,'aelx','sadasd','Sr','dummy@sadsf.com',NULL,84),(57,'aelx','sadasd','Sr','dummy@sadsf.com',NULL,88);
/*!40000 ALTER TABLE `faculty_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grades`
--

DROP TABLE IF EXISTS `grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grade_number` int(11) NOT NULL,
  `title` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grades`
--

LOCK TABLES `grades` WRITE;
/*!40000 ALTER TABLE `grades` DISABLE KEYS */;
INSERT INTO `grades` VALUES (1,1,'1° Primaria'),(2,2,'2° Primaria'),(3,3,'3° Primaria'),(4,4,'4° Primaria');
/*!40000 ALTER TABLE `grades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `indicator_categories`
--

DROP TABLE IF EXISTS `indicator_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `indicator_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `indicator_categories`
--

LOCK TABLES `indicator_categories` WRITE;
/*!40000 ALTER TABLE `indicator_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `indicator_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `indicators`
--

DROP TABLE IF EXISTS `indicators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `indicators` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `indicators_categories_idx` (`category_id`),
  CONSTRAINT `indicators_categories` FOREIGN KEY (`category_id`) REFERENCES `indicator_categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `indicators`
--

LOCK TABLES `indicators` WRITE;
/*!40000 ALTER TABLE `indicators` DISABLE KEYS */;
/*!40000 ALTER TABLE `indicators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `refresh_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `refresh_token` varchar(256) NOT NULL,
  `user_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `issued_timestamp` int(11) NOT NULL,
  `expires_timestamp` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `refresh_tokens_users_idx` (`user_id`),
  KEY `refresh_tokens_clients_idx` (`client_id`),
  CONSTRAINT `refresh_tokens_clients` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `refresh_tokens_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,'00836ae6d3e611ef00c793b70161bf93d5695881',88,1,1442208084,1442211684),(2,'05ed6f747b0b5ff29a569638a15347bfdb8f8a49',88,1,1442208121,1442211721),(3,'7fdad54208c914c7fda8df7ad0f75e1eab02744c',88,1,1442208144,1442211744),(4,'9b32746073af3eb5a2b096c7a81825765d1ad464',88,1,1442208167,1442211767),(5,'bd1b52bd46065ade8ecfe07d8520e1272d78a4ca',88,1,1442208231,1442211831),(6,'b423b3bb3482d2fa46affef55c72eaf01085fe8b',88,1,1442208284,1442211884),(7,'ba907997b848d719c752aa92712cbf003caea83a',88,1,1442208332,1442211932),(8,'43080ad58a8f4f6fb39ab053ee62189e1912393a',88,1,1442208519,1442212119),(9,'d82a450c4f6c2b6d7c2c0dfc6a6165aedb44c4ae',88,1,1442248099,1442251699),(10,'0b5c8a4159d0d2690ba50e52c824c9f149f9706f',88,1,1442248131,1442251731),(11,'43610defd98e878e098470ccae077b6791e7f485',88,1,1442248148,1442251748),(12,'387ae042526a347924ca3dffa3b664b7d29bb4b6',88,1,1442534719,1442538319),(13,'74def2bb39ebffdce5f2881d3bde7ad95f875b3b',88,1,1442541220,1442544820),(14,'0274d94fbcc1e5bd6c987233d88163308eb4b2d5',88,1,1442638128,1442641728),(15,'9ec4e2861cc44249005651b2949e8b8964a9f955',88,1,1442801864,1442805464),(16,'48c269ee42a376f69cb1da5ae051f8a24249e6d9',88,1,1442803573,1442807173),(17,'1ab0ff00b9d7d724d35022b3bcf32c6b1cb64751',88,1,1442803659,1442807259),(18,'a0cd0a1b77e7b7961c8328c48bdcf29c33825977',88,1,1442874526,1442878126),(19,'bef80a31713dddd47f5a49915de0b4650c731299',88,1,1442876813,1442880413),(20,'a263e2cc7d8b1197444223df9e60a81c27e93086',88,1,1442877150,1442880750);
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `revision_details`
--

DROP TABLE IF EXISTS `revision_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `revision_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `revision_id` int(11) NOT NULL,
  `indicator_id` int(11) NOT NULL,
  `input_value` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `revision_details_indicators_idx` (`indicator_id`),
  KEY `revision_details_revisions_idx` (`revision_id`),
  CONSTRAINT `revision_details_indicators` FOREIGN KEY (`indicator_id`) REFERENCES `indicators` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `revision_details_revisions` FOREIGN KEY (`revision_id`) REFERENCES `revisions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `revision_details`
--

LOCK TABLES `revision_details` WRITE;
/*!40000 ALTER TABLE `revision_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `revision_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `revisions`
--

DROP TABLE IF EXISTS `revisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `revisions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_date` int(11) NOT NULL,
  `origin_platform` varchar(20) NOT NULL DEFAULT 'web-app',
  `is_finished` tinyint(4) NOT NULL DEFAULT '0',
  `finished_date` int(11) NOT NULL,
  `last_change_date` int(11) NOT NULL,
  `allocation_id` int(11) NOT NULL,
  `is_in_conflict` tinyint(4) NOT NULL DEFAULT '0',
  `bimester_number` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `revisions_allocations_idx` (`allocation_id`),
  KEY `revisions_bimesters_idx` (`bimester_number`),
  CONSTRAINT `revisions_allocations` FOREIGN KEY (`allocation_id`) REFERENCES `allocations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `revisions_bimesters` FOREIGN KEY (`bimester_number`) REFERENCES `bimesters` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `revisions`
--

LOCK TABLES `revisions` WRITE;
/*!40000 ALTER TABLE `revisions` DISABLE KEYS */;
/*!40000 ALTER TABLE `revisions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'director'),(2,'teacher');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `school_groups`
--

DROP TABLE IF EXISTS `school_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `school_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grade_id` int(11) NOT NULL,
  `group_name` varchar(5) NOT NULL,
  `total_students` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `school_group_grades_idx` (`grade_id`),
  CONSTRAINT `school_group_grades` FOREIGN KEY (`grade_id`) REFERENCES `grades` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school_groups`
--

LOCK TABLES `school_groups` WRITE;
/*!40000 ALTER TABLE `school_groups` DISABLE KEYS */;
INSERT INTO `school_groups` VALUES (1,1,'A',30),(2,1,'B',20),(3,2,'A',25),(4,1,'C',40);
/*!40000 ALTER TABLE `school_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `abbreviation` varchar(5) NOT NULL,
  `title` varchar(45) NOT NULL,
  `grade_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subjects_grades_idx` (`grade_id`),
  CONSTRAINT `subjects_grades` FOREIGN KEY (`grade_id`) REFERENCES `grades` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,'ESP','Español',1),(2,'MAT','Matemáticas',1),(3,'MAT','Matemáticas',2),(4,'MAT','Matemáticas',3);
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(70) NOT NULL,
  `role_id` int(11) NOT NULL DEFAULT '2',
  PRIMARY KEY (`id`),
  KEY `users_roles_idx` (`role_id`),
  CONSTRAINT `users_roles` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'asdf','asdf',2),(2,'alex.ocampo','$2a$10$4k1JlfFvzr1pr.o8l2bImeA6isez26s2Bo/Po1Jedj7n4pnqFys0C',2),(3,'alex.ocampo1','$2a$10$lQ75ZtshOlfg6qm.P/Gh5OYDIKLzQn//4oBpkuVfL.pjib.YtevpO',2),(4,'alex.ocampo2','$2a$10$SZAh/IgPzNVSNdC5zKCUmONf68VC9HSisb5nzbn5buTvKnCS.Jy46',2),(5,'alex.ocampo3','$2a$10$WKJLLgNwJ.SETmfluAIYr.M5Mdx6J/6nSoB/5xE4JPF34COizZzEy',2),(6,'alex.ocampo4','$2a$10$KsV15kni4KEDJmU/PI5O8OhLNMdoMSVq3/m2hVC6pQcM9RlzU7Btu',2),(7,'alex.ocampo5','$2a$10$bttmTzmhcX6qrJJ18S2D0e2pDTZAgKX/yaLzXxi5O8FaE3iKfCjYq',2),(8,'alex.ocampo6','$2a$10$Z4eKnzQvkzJ714bhJcGxRep336khOEybvxBz8BlYDxFmF92gHr7fm',2),(9,'alex.ocampo7','$2a$10$53wGr.QuF4sAiGTpLTouSuXMXhfmComzxzYRNFFlrDGrtoZp2eazK',2),(10,'alex.ocampo8','$2a$10$Mkjdm3IwQTzSjT1UPI4xpuzDAH11TkQ4EUlAo8sDgtI6EJzSt4Wce',2),(11,'alex.9','$2a$10$1FTEES18iLADZAxNBlj0y.rBPehePQ44rneiXUGirlYo2Aut3mBAa',2),(12,'alex.13','$2a$10$/acvb7RElZZScqHM0psxvOiMBmAilpCDvs5HXJ/.M/I1XVM.osDie',2),(13,'alex.14','$2a$10$7/5qu.epFJC20Zi.29blQ.UA.kYgJDdtpyyogOUxGvoHFZREC8M4.',2),(14,'alex.15','$2a$10$VwrQhOF8k4bXU2153vJyUu8.29zIuWxmOVcETleQ/NdZ20wH/5eMm',2),(15,'alex.16','$2a$10$v/4lRrdHg6sFU8FzhAw0bOGN6w3fS.Xu4w5bqPUa4GBANYDgGhQDi',2),(16,'alex.17','$2a$10$HPuLY5g.GGu4axyFIdLJPuDbZrUC4C5qqUwgrCRwbooEbv2cx.qHe',2),(17,'alex.18','$2a$10$mGzsNPm.AM/3iM0lJn5ue.9Hl6BdGmvPH76D9rxpatbQ3nuPMr0ou',2),(18,'alex.19','$2a$10$U/U6pfaR2BK55WgFxHh/8.QR5jiJw9/XyeQNG8HtvCkp9lONAT0qi',2),(19,'alex.20','$2a$10$4Ys3P75rkH9BzNde/Tv9geeiXW/9C4MCSq.4y8R5LRkAQ8ZW9oPqu',2),(20,'alex.21','$2a$10$GE2mDHzFgLHkF5/ybIFlT.fdUcumBB2TgX7i3aq22cI/1teoCXVZq',2),(21,'alex.22','$2a$10$70j9cpXvFBaoCR9ccjQKouqtzql2/UuE92D09LRNkukPZhIPNmwi6',2),(22,'alex.23','$2a$10$KpImi/zRILN.icwMMkyn1./6tnHK/lbqyhuCJ8j65j7yQe81SjqOi',2),(23,'alex.24','$2a$10$ozo50p/nI56DcL24dkjNCeBHYYvmMQqrcv1zQWZyLTO4EZVYb9/Cm',2),(24,'alex.25','$2a$10$gEF6d88wtY7Wk7P94252ZuWmnrTJWOvzdgsTvVNl2eGDd/VCHuVb.',2),(25,'alex.26','$2a$10$abA24kPvb4bvavM.7jxcNemdx7jVhXyawP5X.fL91pzVqxRRc128y',2),(26,'alex.27','$2a$10$EXQYxMrVESqKNdWMf29ffe6mMxBubrKb7KHn0Bf/7zAFOziyzpMnC',2),(27,'alex.28','$2a$10$7AD3w3lw5SB/NvtDeKYrRubpieNuxm91DCRG8VE8696EXbNp4Ej7G',2),(28,'alex.29','$2a$10$1rBSTo1OVT/xuHYOtSkOVug.K9x5.nlY0BHNV./YVTlQmL8Te143O',2),(29,'alex.30','$2a$10$a3WucyCTkhMOxUaa0bMZ7eB0lV6DpJme2cJZHJDuKd9O6IdLPMatu',2),(30,'alex.31','$2a$10$nN6YqS/T4E0PSmMsl/Nv5OD.Zzs35bi/FZ1yrWlDuabzb7AW9njJG',2),(31,'alex.32','$2a$10$h.SriZVzb9rLIf0H1Q8jXOSG7bH5ZoAr39yQjdime4Dan/5SIS1jS',2),(32,'alex.33','$2a$10$yw.pdQhD9ectFk0P07fS/uQJXhDvMMTNYqi0IC2QNcCEcBMkzPp/a',2),(33,'alex.34','$2a$10$WEQIB8bFbfx6jQypWjminezE3fc8.N76juMrTZH5BoPzdqaeM3e4.',2),(69,'alex.38','$2a$10$OuBMtPh6KvY1hL3LGuDdtOnwVpf45uBAAVWZpyxU4jjVri7SzPYzO',2),(70,'alex.38','$2a$10$X9/Z98gfdS6AHbm6owWlQunHDQahE8s0zH32Q.LEv3w8oqlGt4aNm',2),(71,'alex.38','$2a$10$H/1kUN.njTSz7be9UFRGp.GMT3gbJgcbGYcaScA2MvZXis6a/eN4m',2),(72,'alex.38','$2a$10$XdIsoZmZl0UCRG4UtrkjMOmQE/qyxWlXEOxIDFl2qSb1zmjJu26oK',2),(84,'alex.39','$2a$10$HfxaApDTRV6sKiTxIT.2g.t7IjdvwlGx2zEegSjysclhDHqOInQCK',2),(88,'alex.40','$2a$10$1ROnbqW7ZkRBxBBn9AMW.e5/r1Rmfp0jHcOZwBQ7gseFOYGov4kdq',2);
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

-- Dump completed on 2015-09-24 20:52:29
