package es.ual.acg.neo4j.repository;



import org.springframework.data.neo4j.repository.GraphRepository;
import org.springframework.stereotype.Component;



import es.ual.acg.neo4j.domain.User;

@Component
public interface UserNeoRepository extends GraphRepository<User> {

	User findByEmail(String email);
	
}