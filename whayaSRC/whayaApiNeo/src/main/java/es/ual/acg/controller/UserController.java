package es.ual.acg.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import es.ual.acg.neo4j.domain.Friend;
import es.ual.acg.neo4j.domain.Place;
import es.ual.acg.neo4j.domain.Score;
import es.ual.acg.neo4j.domain.User;
import es.ual.acg.neo4j.repository.PlaceNeoRepository;
import es.ual.acg.neo4j.repository.UserNeoRepository;

@RestController
@RequestMapping("/users")
public class UserController {

	@Autowired
	private UserNeoRepository userNeoRepository;
	@Autowired
	private PlaceNeoRepository placeNeoRepository;

	@GetMapping("")
	public ResponseEntity findAll() {

		try {
			Iterable<User> users = this.userNeoRepository.findAll();
			return new ResponseEntity(users, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	//@HystrixCommand(fallbackMethod = "defaultUser")
	@PostMapping("")
	public ResponseEntity createUser(@Param(value = "email") String email, @Param(value = "name") String name, @Param(value = "avatar") String avatar) {

		try {
			User aux = new User(email, name, avatar);
			User compareAux = this.userNeoRepository.findByEmail(email);
			if (compareAux != null) {
				return new ResponseEntity("User already created", HttpStatus.CONFLICT);
			}
			userNeoRepository.save(aux);
			return new ResponseEntity(aux, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	@PostMapping("/{id}")
	public ResponseEntity updateUser(@PathVariable Long id, @Param(value = "name") String name, @Param(value = "avatar") String avatar) {

		try {
			User compareAux = this.userNeoRepository.findOne(id);
			if (compareAux != null) {
				compareAux.setName(name);
				compareAux.setAvatar(avatar);
				userNeoRepository.save(compareAux);
				return new ResponseEntity(compareAux, HttpStatus.OK);
			}
			
			return new ResponseEntity("User does not exist", HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	@GetMapping("/{id}")
	public ResponseEntity findOne(@PathVariable Long id) {
		try {
			User user = userNeoRepository.findOne(id);

			return new ResponseEntity(user, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/email/{email:.+}")
	public ResponseEntity findByEmail(@PathVariable String email) {

		try {
			User user = userNeoRepository.findByEmail(email);
			if (user != null) {
				return new ResponseEntity(user, HttpStatus.OK);
			}
			return new ResponseEntity("Can't find the user", HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/score")
	public ResponseEntity postScore(@Param(value = "score") double score, @Param(value = "comment") String comment,
			@Param(value = "userId") Long userId, @Param(value = "placeId") Long placeId) {
		try {
			User user = userNeoRepository.findOne(userId);
			Place place = placeNeoRepository.findOne(placeId);
			if (user != null && place != null) {

				Score lastScore = user.postScore(place, score, comment);
				userNeoRepository.save(user);
				place.setGeneralScore((place.getGeneralScore() + score) / 2.0);
				placeNeoRepository.save(place);
				return new ResponseEntity(lastScore, HttpStatus.OK);

			} else {
				return new ResponseEntity("Can't find the user or the place", HttpStatus.CONFLICT);
			}

		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	

	@PostMapping("/requestfriend")
	public ResponseEntity addFriend(@RequestParam(value = "userId") Long userId,
			@RequestParam(value = "email") String email) {

		User user = userNeoRepository.findOne(userId);
		User friend = userNeoRepository.findByEmail(email);

		if (friend != null && user != null) {

			Friend lastFriend = user.addFriend(friend, 1);
			friend.addFriend(user, 2);
			userNeoRepository.save(user);
			userNeoRepository.save(friend);

			return new ResponseEntity(lastFriend, HttpStatus.OK);
		}
		return new ResponseEntity("Friend or User doesn't exist", HttpStatus.CONFLICT);

	}

	@PostMapping("/acceptfriend")
	public ResponseEntity acceptFriend(@RequestParam(value = "userId") Long userId,
			@RequestParam(value = "email") String email) {
		System.out.println(userId);
		User user = userNeoRepository.findOne(userId);
		User friend = userNeoRepository.findByEmail(email);

		if (friend != null && user != null) {

			List<Friend> userFriends = user.getFriend();

			for (Friend friendship : userFriends) {
				if (friendship.friendUser().getEmail().equals(email)) {
					friendship.setAccepted(true);
					for (Friend friendship2 : friendship.friendUser().getFriend()) {
						if (friendship2.friendUser().getId().equals(userId)) {
							friendship2.setAccepted(true);
						}
					}
					Friend lastFriend = friendship;
					userNeoRepository.save(user);
					userNeoRepository.save(friend);
					return new ResponseEntity(lastFriend, HttpStatus.OK);
				}
			}

		}
		return new ResponseEntity("Friend or User doesn't exist", HttpStatus.CONFLICT);

	}

	@GetMapping("/friends/{userId}")
	public ResponseEntity getFriend(@PathVariable(value = "userId") Long userId) {
		Map<String, List<User>> response = new HashMap<String, List<User>>();
		User user = userNeoRepository.findOne(userId);

		if (user != null) {

			List<Friend> userFriends = user.getFriend();
			List<User> friendsAccepted = new ArrayList<User>();
			List<User> friendsNonAccepted = new ArrayList<User>();
			List<User> friendsNonAcceptedByMe = new ArrayList<User>();
			for (Friend userFriend : userFriends) {
				if (userFriend.getAccepted())
					friendsAccepted.add(userFriend.friendUser());
				else if(!userFriend.getAccepted() && userFriend.getOrder()==1)
					friendsNonAccepted.add(userFriend.friendUser());
				else if(!userFriend.getAccepted() && userFriend.getOrder()==2)
					friendsNonAcceptedByMe.add(userFriend.friendUser());
			}
			response.put("Accepted", friendsAccepted);
			response.put("NonAccepted", friendsNonAccepted);
			response.put("NonAceptedByMe", friendsNonAcceptedByMe);
			return new ResponseEntity(response, HttpStatus.OK);

		}
		return new ResponseEntity("User doesn't exist", HttpStatus.CONFLICT);

	}
	@PostMapping("/createPlace")
	public ResponseEntity createPlace(@RequestParam(value = "userId") Long userId, @Param(value = "name") String name, @Param(value = "longitude") double longitude, @Param(value = "latitude") double latitude, @Param(value = "date") String date) {

	User user = userNeoRepository.findOne(userId);
	Place place = new Place(name, longitude, latitude, date);

	if (user != null) {


	place = placeNeoRepository.save(place);
	place = placeNeoRepository.addToSpatialIndex(name);
	user = user.createPlace(place);
	user = userNeoRepository.save(user);

	return new ResponseEntity(user, HttpStatus.OK);
	}
	return new ResponseEntity("User doesn't exist", HttpStatus.CONFLICT);

	}
	
	public ResponseEntity defaultUser(@Param(value = "email") String email, @Param(value = "name") String name) {
        return new ResponseEntity(null, HttpStatus.BAD_GATEWAY);
    }
}
