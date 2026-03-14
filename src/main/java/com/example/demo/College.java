package com.example.demo;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
 
@Entity
public class College {
    private Integer id;
    private String admin;
    private String name;
    private String location;
 
    public College() {
    }
 
    public College(Integer id, String admin, String name, String location) {
        
    	this.id = id;
        this.admin = admin;
        this.name = name;
        this.location = location;
    }
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {
        return id;
    }

	public void setId(Integer id) {
		this.id = id;
	}

	public String getAdmin() {
		return admin;
	}

	public void setAdmin(String admin) {
		this.admin = admin;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public String getLocation() {
		return location;
	}
	
	public void setLocation(String location) {
		this.location=location;
	}

	@Override
	public String toString() {
		return "College [id=" + id + ", admin=" + admin + ", name=" + name + ", location=" + location + "]";
	}
}