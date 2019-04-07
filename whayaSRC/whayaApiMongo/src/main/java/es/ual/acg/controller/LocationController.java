package es.ual.acg.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



import es.ual.acg.mongodb.domain.Location;
import es.ual.acg.mongodb.repository.LocationRepository;



@RestController
@RequestMapping("/locations")
public class LocationController {

	@Autowired
	private LocationRepository locationMongoRepository;
	
	@PreAuthorize("#oauth2.hasScope('admin')")
	@GetMapping("")
	public ResponseEntity findAll() {

		try {
			Iterable<Location> locations = this.locationMongoRepository.findAll();
			return new ResponseEntity(locations, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	
	@PreAuthorize("#oauth2.hasScope('admin')")
	@GetMapping("/{id}")
	public ResponseEntity findOne(@PathVariable String id) {
		try {
			Location location = locationMongoRepository.findOne(id);

			return new ResponseEntity(location, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PreAuthorize("#oauth2.hasScope('admin')")
	@GetMapping("/email/{email:.+}")
	public ResponseEntity findByEmail(@PathVariable String email) {

		try {
			Iterable<Location> locations = this.locationMongoRepository.findByEmail(email);
			return new ResponseEntity(locations, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	
	@PreAuthorize("#oauth2.hasScope('admin')")
	@GetMapping("/date")
	public ResponseEntity findByDate(@DateTimeFormat(pattern="MMddyyyy") Date fromDate, @DateTimeFormat(pattern="MMddyyyy") Date toDate) {

		try {
			List<Location> locations = this.locationMongoRepository.findByDateBetween(fromDate, toDate);
			return new ResponseEntity(locations, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	
	@PreAuthorize("#oauth2.hasScope('admin')")
	@GetMapping("/date/email/{email:.+}")
	public ResponseEntity findByEmailDate(@PathVariable String email,@DateTimeFormat(pattern="MMddyyyy") Date fromDate, @DateTimeFormat(pattern="MMddyyyy") Date toDate) {

		try {
			List<Location> locations = this.locationMongoRepository.findByEmailAndDateBetween(email, fromDate, toDate);
			return new ResponseEntity(locations, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	//@HystrixCommand(fallbackMethod = "defaultLocation")
	@PostMapping("")
	public ResponseEntity postLocation(@Param(value = "email") String email, @Param(value = "latitude") double latitude, @Param(value = "longitude") double longitude) {

		try {
			Location aux = new Location(email, latitude, longitude);
			locationMongoRepository.save(aux);
			return new ResponseEntity(aux, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	
	public ResponseEntity defaultLocation(@Param(value = "email") String email, @Param(value = "latitude") double latitude, @Param(value = "longitude") double longitude) {
        return new ResponseEntity(null, HttpStatus.BAD_GATEWAY);
    }
	
	
}
