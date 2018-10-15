function User (bu_id, id, username, password, fullname, email, active) {
	this.bu_id 		= bu_id;
    this.id 		= id;
    this.username 	= username;
    this.password 	= password;
    this.fullname 	= fullname;
    this.email    	= email;
    this.active   	= active;
  }

module.exports = User;
