package es.ual.acg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import es.ual.acg.domain.User;


@Component
public interface UserRepository extends JpaRepository<User, Long>{

	User findByUsername(String username);
}
