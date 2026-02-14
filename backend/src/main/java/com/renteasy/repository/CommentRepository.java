package com.renteasy.repository;

import com.renteasy.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {
    
    List<Comment> findByItemIdOrderByCreatedAtDesc(String itemId);
    
    List<Comment> findByUserIdOrderByCreatedAtDesc(String userId);
    
    List<Comment> findByParentCommentIdOrderByCreatedAtAsc(String parentCommentId);
}
