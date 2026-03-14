package com.example.demo;


import java.util.List;

import javax.transaction.Transactional;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
@Service
@Transactional
public class CertificateService {
 
    @Autowired
    private CertificateRepository rep2;
     
    public List<Certificate> listAll() {
        return rep2.findAll();
    }
     
    public void save(Certificate certificate) {
        rep2.save(certificate);
    }
     
    public Certificate get(Integer id) {
        return rep2.findById(id).get();
    }
     
    public void delete(Integer id) {
        rep2.deleteById(id);
    }
    
}