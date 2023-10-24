const router = require('express').Router()
const { Address, User } = require('../models')
const { tokenExtractor, isAdmin } = require('../utils/middleware')

router.post('/', async (req, res) => {
  const address = await Address.create(req.body)
  res.json(address)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const address = await Address.findByPk(req.params.id)
  if (address) {
    await address.update(req.body)
    res.json(address)
  } else {
    res.status(404).send('Address not found')
  }
})

router.get('/:id', tokenExtractor, async (req, res) => {
  const address = await Address.findByPk(req.params.id)
  if (address) {
    res.json(address)
  } else {
    res.status(404).send('Address not found')
  }
})

router.delete('/:id', tokenExtractor, async (req, res) => {
  const address = await Address.findByPk(req.params.id)
  if (address) {
    await address.destroy()
    res.status(204).send()
  } else {
    res.status(404).send('Address not found')
  }
})

module.exports = router
