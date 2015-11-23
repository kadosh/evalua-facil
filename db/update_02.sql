ALTER TABLE `evalua`.`students` 
DROP FOREIGN KEY `students_school_groups`;
ALTER TABLE `evalua`.`students` 
ADD CONSTRAINT `students_school_groups`
  FOREIGN KEY (`school_group_id`)
  REFERENCES `evalua`.`school_groups` (`id`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION;

ALTER TABLE `evalua`.`allocations` 
DROP FOREIGN KEY `allocations_faculty_members`,
DROP FOREIGN KEY `allocations_school_groups`;
ALTER TABLE `evalua`.`allocations` 
ADD CONSTRAINT `allocations_faculty_members`
  FOREIGN KEY (`faculty_member_id`)
  REFERENCES `evalua`.`faculty_members` (`id`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION,
ADD CONSTRAINT `allocations_school_groups`
  FOREIGN KEY (`school_group_id`)
  REFERENCES `evalua`.`school_groups` (`id`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION;

ALTER TABLE `evalua`.`faculty_members` 
DROP FOREIGN KEY `faculty_members_users`;
ALTER TABLE `evalua`.`faculty_members` 
ADD CONSTRAINT `faculty_members_users`
  FOREIGN KEY (`user_id`)
  REFERENCES `evalua`.`users` (`id`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION;
