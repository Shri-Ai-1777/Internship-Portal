package com.example.demo;




import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
 
@Entity
public class Certificate {
    private Integer id;
    private String year;
    private String college;
 
 
    public Certificate() {
    }
 
    public Certificate(Integer id, String year, String college) {
    	 super();
        this.id = id;
        this.year = year;
        this.college = college;
       
        
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}

	public String getCollege() {
		return college;
	}

	public void setCollege(String college) {
		this.college = college;
	}

	@Override
	public String toString() {
		return "Certificate [id=" + id + ", year=" + year + ", college=" + college + "]";
	}
   
	

	

}