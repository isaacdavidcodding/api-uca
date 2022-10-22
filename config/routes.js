module.exports = app => {



  app.route('/users')
    .get(app.api.user.get)
}
