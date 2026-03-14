package com.example.demo;
import java.util.List;

import javax.transaction.Transactional;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
@Service
@Transactional
public class UserService {
	@Autowired
	private UserRepository rep1;
    
    public List<User> listAll() {
        return rep1.findAll();
    }
     
    public void save(User user) {
        rep1.save(user);
    }
     
    public User get(Integer id) {
        return rep1.findById(id).get();
    }
     
    public void delete(Integer id) {
        rep1.deleteById(id);
    }

}
