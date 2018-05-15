function User (id, username, password, email, active) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email    = email;
    this.active   = active;
  }

module.exports = User;
