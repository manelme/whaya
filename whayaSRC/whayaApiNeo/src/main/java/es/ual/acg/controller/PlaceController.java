package es.ual.acg.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.ual.acg.neo4j.domain.Friend;
import es.ual.acg.neo4j.domain.Place;
import es.ual.acg.neo4j.domain.User;
import es.ual.acg.neo4j.repository.PlaceNeoRepository;
import es.ual.acg.neo4j.repository.UserNeoRepository;

@RestController
@RequestMapping("/places")
public class PlaceController {

	@Autowired
	private PlaceNeoRepository placeNeoRepository;
	@Autowired
	private UserNeoRepository userNeoRepository;

	@GetMapping("")
	public ResponseEntity findAll() {
		try {
			Iterable<Place> places = placeNeoRepository.findAll();
			return new ResponseEntity(places, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@GetMapping("/name/{name}")
	public ResponseEntity findByName(@PathVariable String name) {
		try {

			Place place = placeNeoRepository.findByName(name);
			if (place != null)
				return new ResponseEntity(place, HttpStatus.OK);
			return new ResponseEntity("There's no place with that name", HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@GetMapping("/{id}")
	public ResponseEntity findOne(@PathVariable Long id) {

		try {
			Place place = placeNeoRepository.findOne(id);
			if (place != null)
				return new ResponseEntity(place, HttpStatus.OK);
			return new ResponseEntity("There's no place with that id", HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	
	//@HystrixCommand(fallbackMethod = "defaultPlace")
	@PostMapping("")
	public ResponseEntity postPlace(@Param(value = "name") String name, @Param(value = "longitude") double longitude,
			@Param(value = "latitude") double latitude, @Param(value = "date") String date) {

		try {

			Place exist = this.placeNeoRepository.findByName(name);
			if (exist != null)
				return new ResponseEntity("The place already exist", HttpStatus.CONFLICT);
			Place aux = placeNeoRepository.save(new Place(name, longitude, latitude, date));
			return new ResponseEntity(placeNeoRepository.addToSpatialIndex(aux.getName()), HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	

	@GetMapping("/close/{userId}")
	public ResponseEntity closePlacesFriends(@PathVariable(value = "userId") Long userId, @Param(value = "longitude") double longitude,
			@Param(value = "latitude") double latitude, @Param(value = "distance") double distance) {
			
		try {
			List<Place> friendPlaceList = new ArrayList<Place>();
			User user = userNeoRepository.findOne(userId);
			if (user != null) {
				List<Friend> userFriends = user.getFriend();
				List<User> friendsAccepted = new ArrayList<User>();
				for (Friend userFriend : userFriends) {
					if (userFriend.getAccepted())
						friendsAccepted.add(userFriend.friendUser());
				}
				List<Place> list = placeNeoRepository.closePlaces(latitude, longitude, distance);
				for (Place place : list) {
					for (User friend : friendsAccepted) {
						User friendAux = this.userNeoRepository.findOne(friend.getId());
						for (Place friendPlace : friendAux.getPlaces()) {
							if(place.getId() == friendPlace.getId()) {
								friendPlaceList.add(place);
							}
						}
					}
				}
				return new ResponseEntity(friendPlaceList, HttpStatus.OK);
			}else {
				return new ResponseEntity("User doesn't exist", HttpStatus.INTERNAL_SERVER_ERROR);
			}
			
		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	@GetMapping("/close")
	public ResponseEntity closePlaces(@Param(value = "longitude") double longitude,
			@Param(value = "latitude") double latitude, @Param(value = "distance") double distance) {

		try {

			List<Place> list = placeNeoRepository.closePlaces(latitude, longitude, distance);
			return new ResponseEntity(list, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	
	public ResponseEntity defaultPlace(@Param(value = "name") String name, @Param(value = "longitude") double longitude,
			@Param(value = "latitude") double latitude) {
        return new ResponseEntity(null, HttpStatus.BAD_GATEWAY);
    }
}
