module.exports = app => {



  app.route('/users')
    .get(app.api.user.get)
    .post(app.api.user.save)

  app.route('/users/:id')
    .put(app.api.user.save)
    .get(app.api.user.getById)
    .delete(app.api.user.remove)
}
