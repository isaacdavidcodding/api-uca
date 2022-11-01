module.exports = app => {
  const { existsOrError, notExistsOrError } = app.api.validation

  const get = (req, res) => {
    app.db('categories')
      .then(categories => res.json((categories)))
      .catch(error => res.status(500).send(error))
  }

  const getById = (req, res) => {
    app.db('categories')
      .where({ id: req.params.id })
      .first()
      .then(category => res.json(category))
      .catch(error => res.status(500).send(error))
  }

  const save = (req, res) => { 
    const category = { ...req.body }

    if (req.params.id) category.id = req.params.id

    try {
      existsOrError(category.name, 'Nome não informado')
    } catch(error) {
      return res.status(400).send(error)
    }

    if (category.id) {
      app.db('categories')
        .update(category)
        .where({ id: category.id })
        .then(_ => res.status(204).send())
        .catch(error => res.status(500))
    } else {
      app.db('categories')
        .insert(category)
        .then(_ => res.status(204).send())
        .catch(error => res.status(500).send(error))
    }
  }

  const remove = async (req, res) => {
    try {
      existsOrError(req.params.id, 'Código da categoria não informado')

      const subcategory = await app.db('categories').where({ parentId: req.params.id })
      notExistsOrError(subcategory, 'Categoria possui subcategorias')

      const articles = await app.db('articles').where({ categoryId: req.params.id })
      notExistsOrError(articles, 'Categoria possui artigos')

      const rowDeleted = await app.db('categories').where({ id: req.params.id }).del()
      existsOrError(rowDeleted, 'Categoria não informada')

      res.status(204).send()
    } catch (error) {
      res.status(400).send(error)
    }
  }

  const withPath = categories => {    
    const getParent = (cotegories, parentId) => {
      const parent = categories.filter(parent => parent.id === parentId)
      return parent.length ? parent[0] : null
    }

    const categoriesWithPath = categories.map(category => {
      let path = category.name
      let parent = getParent(categories, category.parentId)

      while (parent) {
        path = `${parent.name} > ${path}`
        parent = getParent(categories, parent.parentId)
      }

      return { ...category, path }
    })

    categoriesWithPath.sort((catA, catB) => {
      if (catA.path < catB.path) return -1
      if (catA.path > catB.path) return 1

      return 0
    })

    return categoriesWithPath
  }

  const toTree = (categories, tree) => {
    if (!tree) tree = categories.filter(cat => !cat.parentId) 

    tree = tree.map(parentNode => {
      const isChild = node => node.parentId == parentNode.id

      parentNode.children = toTree(categories, categories.filter(isChild))

      return parentNode
    })

    return tree
  }

  const getTree = (req, res) => {
    app.db('categories')
      .then(categories => res.json(toTree(withPath(categories))))
      .catch(error => res.status(500).send(error))
  }

  return { get, getById, save, remove, getTree }
}
