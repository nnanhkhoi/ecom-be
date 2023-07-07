const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { User } = require('./../models')

usersRouter.post('/', async (request, response) => {
  const { name, email, password, phoneNumber, address } = request.body

  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  try {
    const user = await User.create({
      name,
      email,
      hashedPassword,
      phoneNumber,
      address,
    })

    response.status(201).json(user)
  } catch (error) {
    response.status(400).json({ error })
  }
})

usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.findAll({})
    response.json(users)
  } catch (err) {
    console.error(err)
    response.status(500).send('Server error')
  }
})

usersRouter.get('/admin', async (request, response) => {
  try {
    const users = await User.findAll({
      where: { isAdmin: true },
    })
    response.json(users)
  } catch (err) {
    console.error(err)
    response.status(500).send('Server error')
  }
})

usersRouter.get('/:id', async (request, response) => {
  try {
    const { id } = request.params
    const user = await User.findByPk(id)
    if (!user) {
      return response.status(404).send('User not found')
    }
    response.json(user)
  } catch (err) {
    console.error(err)
    response.status(500).send('Server error')
  }
})

usersRouter.put('/:id', async (request, response) => {
  try {
    const { id } = request.params
    const { name, email, password, phoneNumber, address } = request.body

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = await User.findByPk(id)
    if (!user) {
      return response.status(404).send('User not found')
    }

    const updatedUser = await user.update({
      name,
      email,
      hashedPassword,
      phoneNumber,
      address,
    })

    response.json(updatedUser)
  } catch (err) {
    console.error(err)
    response.status(500).send('Server error')
  }
})

usersRouter.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params

    const user = await User.findByPk(id)

    if (!user) {
      return response.status(404).send('User not found')
    }

    await user.destroy()

    response.status(204).end()
  } catch (err) {
    console.error(err)
    response.status(500).send('Server error')
  }
})

module.exports = usersRouter
