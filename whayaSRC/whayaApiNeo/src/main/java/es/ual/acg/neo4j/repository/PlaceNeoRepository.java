package es.ual.acg.neo4j.repository;




import java.util.List;

import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.GraphRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Component;

import es.ual.acg.neo4j.domain.Place;




@Component
public interface PlaceNeoRepository extends GraphRepository<Place> {

	@Query("MATCH (n:Place) WHERE NOT (n)<-[:RTREE_REFERENCE]-() AND n.name = {name} CALL spatial.addNode('LocationsLayer', n) YIELD node RETURN node")
	Place addToSpatialIndex(@Param(value = "name") String name);

	Place findByName(String name);
	
	
	@Query("CALL spatial.withinDistance('LocationsLayer',{longitude:{longitude},latitude:{latitude}},{distance})")
	List<Place> closePlaces(@Param(value = "latitude") double latitude, @Param(value = "longitude") double longitude, @Param(value = "distance") double distance);
}