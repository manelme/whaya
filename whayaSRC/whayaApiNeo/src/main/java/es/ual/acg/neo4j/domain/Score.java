package es.ual.acg.neo4j.domain;

import org.neo4j.ogm.annotation.EndNode;
import org.neo4j.ogm.annotation.GraphId;
import org.neo4j.ogm.annotation.Property;
import org.neo4j.ogm.annotation.RelationshipEntity;
import org.neo4j.ogm.annotation.StartNode;

@RelationshipEntity(type="SCORE")
public class Score {

	@GraphId private Long relationshipId;
	
	@Property private double score;
	@Property private String comment;
	
    @StartNode private User user;
    @EndNode private Place place;
    
    public Score() {
    
    }
	
    public Score(User user, Place place, double score, String comment) {
    	this.user=user;
    	this.place=place;
    	this.score=score;
    	this.comment = comment;
    }
    
    public Long getRelationshipId() {
		return relationshipId;
	}

	public void setRelationshipId(Long relationshipId) {
		this.relationshipId = relationshipId;
	}

	public double getScore() {
		return score;
	}
	public void setScore(double score) {
		this.score = score;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
