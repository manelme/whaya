package es.ual.acg.mongodb.domain;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "locations")
public class Location {

	@Id private String id;
	private String email;
	
	private Date date;
	
	private double latitude;
	private double longitude;
	
	public Location() {
		this.date = new Date();
	}
	public Location(String email, double latitude, double longitude) {
		this.email = email;
		this.latitude = latitude;
		this.longitude = longitude;
		this.date = new Date();
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public double getLatitude() {
		return latitude;
	}
	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}
	public double getLongitude() {
		return longitude;
	}
	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
}
