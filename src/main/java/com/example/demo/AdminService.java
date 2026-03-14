package com.example.demo;


import java.util.List;

import javax.transaction.Transactional;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
@Service
@Transactional
public class AdminService {
 
    @Autowired
    private AdminRepository repi;
     
    public List<Admin> listAll() {
        return repi.findAll();
    }
     
    public void save(Admin admin) {
        repi.save(admin);
    }
     
    public Admin get(Integer id) {
        return repi.findById(id).get();
    }
     
    public void delete(Integer id) {
        repi.deleteById(id);
    }
    
}