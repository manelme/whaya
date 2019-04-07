package es.ual.acg.mongodb.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Component;

import es.ual.acg.mongodb.domain.Location;


@Component
public interface LocationRepository extends MongoRepository<Location, String> {

		List<Location> findByEmail(String email);

		List<Location> findByDateBetween(Date fromDate, Date toDate);
		
		@Query("{'$and': [{ 'email' : ?0}, {'date' : {$gte : ?1, $lte: ?2 }}]}")
		List<Location> findByEmailAndDateBetween(String email, Date fromDate, Date toDate);
}