function User (id, username, password, fullname, email, active) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.fullname = fullname;
    this.email    = email;
    this.active   = active;
  }

module.exports = User;
