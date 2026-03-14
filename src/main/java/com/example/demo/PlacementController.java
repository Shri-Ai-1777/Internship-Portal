package com.example.demo;

import java.util.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
public class PlacementController {
	@Autowired
	private PlacementService service;
	
	//Restful API methods for Retrieval operations
	@GetMapping("/placements")
	public List<Placement> list(){
		return service.listAll();
	}
	@GetMapping("/placements/{id}")
	public ResponseEntity<Placement>
	get(@PathVariable Integer id) {
		try {
			Placement placement = service.get(id);
			return new ResponseEntity<Placement>(placement, HttpStatus.OK);
		} catch (NoSuchElementException e) {
			return new ResponseEntity<Placement>(HttpStatus.NOT_FOUND);
		}
	}
// RestfulAPI method for Create operation
	@PostMapping("/placements")
	public void add(@RequestBody Placement placement) {
    service.save(placement);		
	}
	//Restful API method for Update operation
	@PutMapping("/placements/{id}")
	public ResponseEntity<?>
	update(@RequestBody Placement placement, @PathVariable Integer id) {
		try {
			Placement existPlacement = service.get(id);
			service.save(placement);
			return new ResponseEntity<>(HttpStatus.OK);
		}catch (NoSuchElementException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	//RestfulAPI method for Delete operation
	@DeleteMapping("/placements/{id}")
	public void delete(@PathVariable Integer id) {
		service.delete(id);
	}
}
