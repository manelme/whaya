package es.ual.acg.domain;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@SuppressWarnings("serial")
@Entity(name="authorities")
public class Authorizations implements Serializable {

	@Id @GeneratedValue
	private Long id;
	private String username;
	private String authority;

	public Authorizations() {

	}

	public Authorizations(String username) {

		this.username = username;
		this.authority = "ROLE_USER";
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getAuthority() {
		return authority;
	}

	public void setAuthority(String authority) {
		this.authority = authority;
	}

}
