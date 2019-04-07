package es.ual.acg;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import es.ual.acg.domain.Authorizations;
import es.ual.acg.domain.User;
import es.ual.acg.repository.AuthorizationsRepository;
import es.ual.acg.repository.UserRepository;


@RestController
@RequestMapping("/user")
public class UserController {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private AuthorizationsRepository authorizationsRepository;
	
	
	@GetMapping("/{username}")
	public ResponseEntity findByUsername(@PathVariable String username) {
		try {
			
			User user = userRepository.findByUsername(username);
			if(user!=null)
				return new ResponseEntity(user, HttpStatus.OK);
			else
				return new ResponseEntity("User not found", HttpStatus.NOT_FOUND);
		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	//@HystrixCommand(fallbackMethod = "defaultUser")
	@PostMapping("")
	public ResponseEntity postUser(@RequestParam(value = "username") String username, @RequestParam(value="password") String password) {

		try {
			
			User user = userRepository.findByUsername(username);
			if(user!=null) {
				return new ResponseEntity("User already created", HttpStatus.CONFLICT);
			}else {
				User aux = new User(username, password);
				userRepository.save(aux);
				authorizationsRepository.save(new Authorizations(username));
				return new ResponseEntity(aux, HttpStatus.OK);
			}
			
		} catch (Exception e) {
			return new ResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	
	public ResponseEntity defaultUser(@RequestParam(value = "username") String username, @RequestParam(value="password") String password) {
        return new ResponseEntity(null, HttpStatus.BAD_GATEWAY);
    }
	
}
