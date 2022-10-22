const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/banco_teste_stats', { useNewUrlParser: true })
  .catch(e => {
    const msg = 'Não foi possível fazer a conexão com o MonboDB'
    console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m')
  })
