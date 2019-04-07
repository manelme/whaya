package es.ual.acg.neo4j.domain;

import org.neo4j.ogm.annotation.EndNode;
import org.neo4j.ogm.annotation.GraphId;
import org.neo4j.ogm.annotation.Property;
import org.neo4j.ogm.annotation.RelationshipEntity;
import org.neo4j.ogm.annotation.StartNode;

@RelationshipEntity(type = "FRIEND")
public class Friend {

	@GraphId private Long relationshipId;

	@Property private boolean accepted;
	@Property private int order;

	@StartNode private User user;
	@EndNode private User userFriend;

	public Friend() {

	}

	public Friend(User user, User userFriend, boolean accepted) {
		this.user = user;
		this.userFriend = userFriend;
		this.accepted = accepted;
	}
	public Friend(User user, User userFriend, boolean accepted, int order) {
		this.user = user;
		this.userFriend = userFriend;
		this.order = order;
		this.accepted = accepted;
	}
	

	public int getOrder() {
		return order;
	}

	public void setOrder(int order) {
		this.order = order;
	}

	public Long getRelationshipId() {
		return relationshipId;
	}

	public void setRelationshipId(Long relationshipId) {
		this.relationshipId = relationshipId;
	}

	public boolean getAccepted() {
		return accepted;
	}

	public void setAccepted(boolean status) {
		this.accepted = status;
	}
	
	public User friendUser() {
		return userFriend;
	}

}
