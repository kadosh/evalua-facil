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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `alt_student_evaluation_details`
--

DROP TABLE IF EXISTS `alt_student_evaluation_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alt_student_evaluation_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alt_student_evaluation_id` int(11) NOT NULL,
  `indicator_id` int(11) NOT NULL,
  `input_value` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `alt_student_evaluation_details_indicators_idx` (`indicator_id`),
  KEY `alt_student_evaluation_details_evaluations_idx` (`alt_student_evaluation_id`),
  CONSTRAINT `alt_student_evaluation_details_evaluations` FOREIGN KEY (`alt_student_evaluation_id`) REFERENCES `alt_student_evaluations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `alt_student_evaluation_details_indicators` FOREIGN KEY (`indicator_id`) REFERENCES `indicators` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `alt_student_evaluations`
--

DROP TABLE IF EXISTS `alt_student_evaluations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alt_student_evaluations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bimester_number` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `created_timestamp` int(11) NOT NULL,
  `last_change_timestamp` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `is_finished` tinyint(4) NOT NULL DEFAULT '0',
  `finished_timestamp` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `alt_student_evaluations_subjects_idx` (`subject_id`),
  KEY `alt_student_evaluations_students_idx` (`student_id`),
  CONSTRAINT `alt_student_evaluations_students` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `alt_student_evaluations_subjects` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `evaluations`
--

DROP TABLE IF EXISTS `evaluations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `evaluations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `total_done` int(11) NOT NULL,
  `start_timestamp` int(11) NOT NULL,
  `last_update_timestamp` int(11) NOT NULL,
  `allocation_id` int(11) NOT NULL,
  `bimester_number` int(11) NOT NULL,
  `is_finished` int(11) NOT NULL DEFAULT '0',
  `finished_timestamp` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `evaluations_allocations_idx` (`allocation_id`),
  CONSTRAINT `evaluations_allocations` FOREIGN KEY (`allocation_id`) REFERENCES `allocations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
-- Table structure for table `indicators`
--

DROP TABLE IF EXISTS `indicators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `indicators` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_evaluation_details`
--

DROP TABLE IF EXISTS `student_evaluation_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_evaluation_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_evaluation_id` int(11) NOT NULL,
  `indicator_id` int(11) NOT NULL,
  `input_value` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_evaluation_details_indicators_idx` (`indicator_id`),
  KEY `student_evaluation_details_evaluations_idx` (`student_evaluation_id`),
  CONSTRAINT `student_evaluation_details_evaluations` FOREIGN KEY (`student_evaluation_id`) REFERENCES `student_evaluations` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `student_evaluation_details_indicators` FOREIGN KEY (`indicator_id`) REFERENCES `indicators` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_evaluations`
--

DROP TABLE IF EXISTS `student_evaluations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_evaluations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bimester_number` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `created_timestamp` int(11) NOT NULL,
  `last_change_timestamp` int(11) NOT NULL,
  `is_in_conflict` tinyint(4) NOT NULL DEFAULT '0',
  `student_id` int(11) NOT NULL,
  `is_finished` tinyint(4) NOT NULL DEFAULT '0',
  `finished_timestamp` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `student_evaluations_subjects_idx` (`subject_id`),
  KEY `student_evaluations_students_idx` (`student_id`),
  CONSTRAINT `student_evaluations_students` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `student_evaluations_subjects` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `mothers_name` varchar(50) NOT NULL,
  `school_group_id` int(11) NOT NULL,
  `gender` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `students_school_groups_idx` (`school_group_id`),
  CONSTRAINT `students_school_groups` FOREIGN KEY (`school_group_id`) REFERENCES `school_groups` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `is_locked` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `users_roles_idx` (`role_id`),
  CONSTRAINT `users_roles` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-11-07 22:25:30
