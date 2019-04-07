package es.ual.acg.neo4j.domain;

import java.util.ArrayList;
import java.util.List;


import org.neo4j.ogm.annotation.GraphId;
import org.neo4j.ogm.annotation.Index;
import org.neo4j.ogm.annotation.NodeEntity;


@NodeEntity
public class User {

	@GraphId private Long id;

	@Index(unique=true) private String email;
	
	private String name;
	
	private String avatar;
	
	private List<Friend> friend;

	private List<Score> score;
	private List<Place> places;
	
	public User() {
		score = new ArrayList<Score>();
		friend = new ArrayList<Friend>();
		this.places = new ArrayList<Place>();
	}
	public User(String email, String name) {
		this.email = email;
		this.name = name;
		this.score = new ArrayList<Score>();
		this.friend = new ArrayList<Friend>();
		this.places = new ArrayList<Place>();
	}
	public User(String email, String name, String avatar) {
		this.email = email;
		this.name = name;
		this.avatar = avatar;
		this.score = new ArrayList<Score>();
		this.friend = new ArrayList<Friend>();
		this.places = new ArrayList<Place>();
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<Score> getScores() {
		return score;
	}

	public void setScores(List<Score> scores) {
		this.score = scores;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public Score postScore(Place place, double score, String comment) {
        Score aux = new Score(this, place, score, comment);
        this.score.add(aux);
        return aux;
    }
	public User createPlace(Place place) {
		this.places.add(place);
		return this;
	}
	public Friend addFriend(User friend) {
		Friend aux = new Friend(this,friend, false);
        this.friend.add(aux);
        return aux;
    }
	public Friend addFriend(User friend, int order) {
		Friend aux = new Friend(this,friend, false, order);
        this.friend.add(aux);
        return aux;
    }

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Friend> getFriend() {
		return friend;
	}

	public void setFriend(List<Friend> friend) {
		this.friend = friend;
	}
	public String getAvatar() {
		return avatar;
	}
	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}
	public List<Place> getPlaces() {
		return places;
	}
	public void setPlaces(List<Place> places) {
		this.places = places;
	}
}
