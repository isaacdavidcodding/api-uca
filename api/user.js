
module.exports = app => {

  const get = (req, res) => {
    app.db('users')
      .select('id', 'name', 'email', 'admin')
      .then(users => console.log(res.json(users)))
      .catch(err => res.status(500).send(err))
  }

  return { get }
}
