package com.example.demo;
import java.util.List;

import javax.transaction.Transactional;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
@Service
@Transactional
public class PlacementService {
	@Autowired
	private PlacementRepository repo3;
    
    public List<Placement> listAll() {
        return repo3.findAll();
    }
     
    public void save(Placement placement) {
        repo3.save(placement);
    }
     
    public Placement get(Integer id) {
        return repo3.findById(id).get();
    }
     
    public void delete(Integer id) {
        repo3.deleteById(id);
    }

}
