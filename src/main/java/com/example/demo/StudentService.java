package com.example.demo;



import java.util.List;

import javax.transaction.Transactional;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
@Service
@Transactional
public class StudentService {
 
    @Autowired
    private StudentRepository repo4;
     
    public List<Student> listAll() {
        return repo4.findAll();
    }
     
    public void save(Student student) {
        repo4.save(student);
    }
     
    public Student get(Integer id) {
        return repo4.findById(id).get();
    }
     
    public void delete(Integer id) {
        repo4.deleteById(id);
    }
    
}