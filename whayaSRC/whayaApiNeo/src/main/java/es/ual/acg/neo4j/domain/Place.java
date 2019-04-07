package es.ual.acg.neo4j.domain;


import org.neo4j.ogm.annotation.GraphId;
import org.neo4j.ogm.annotation.Index;
import org.neo4j.ogm.annotation.NodeEntity;

@NodeEntity
public class Place {

	
	@GraphId private Long id;

	@Index(unique=true) private String name;
	private double longitude;
	private double latitude;
	private String date;
	
	private double generalScore;
	
	public Place() {
		this.generalScore=0;
	}
	public Place(String name, double longitude, double latitude) {
		
		this.name=name;
		this.longitude=longitude;
		this.latitude=latitude;
		this.generalScore=0;
		
	}
	public Place(String name, double longitude, double latitude, String date) {
		
		this.name=name;
		this.longitude=longitude;
		this.latitude=latitude;
		this.generalScore=0;
		this.date = date;
		
	}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public double getGeneralScore() {
		return generalScore;
	}
	public void setGeneralScore(double generalScore) {
		this.generalScore = generalScore;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public double getLongitude() {
		return longitude;
	}
	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}
	public double getLatitude() {
		return latitude;
	}
	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	
}
