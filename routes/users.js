const NeDB = require ('nedb')
const { check, validationResult } = require('express-validator')

const database = new NeDB({
    filename: "users.db",
    autoload: true
})

module.exports = (app) => {

    const route = app.route('/users')

    route.get((req, res) => {
        database
        .find ({}) // Um objeto vazio {} significa que é para retornar todos os usuários, não é uma consulta específica
        .sort ({name: 1}) // sort é para ordenar o resultado, passando 1 é de forma ascendente, -1 é de forma descendente
        .exec((error, data) => {
            if (error)
            {
                app.utils.error.send(error, req, res)
            }
            else
            {
                res.status(200).json({ error: false, response: data })
            }
        })
    })
    
    route.post (
        [
            check ('first_name', 'O nome é requerido').notEmpty(),
            check ('first_name', 'O nome precisa ter no mínimo 3 letras').isLength({ min: 3 }),
            check ('last_name', 'O sobrenome é requerido').notEmpty(),
            check ('last_name', 'O sobrenome precisa ter no mínimo 3 letras').isLength({ min: 3 }),
            check ('email', 'O e-mail é requerido').notEmpty(),
            check ('email', 'O e-mail esta inválido').isEmail(),
        ],
        (req, res) => {

            let errors = validationResult(req)

            if ( ! errors.isEmpty() )
            {
                return res.status(422).json({ error: true, response: errors })

                return false
            }

            database.insert(req.body, (error, data) => {
                if (error)
                {
                    app.utils.error.send(error, req, res)
                }
                else
                {
                    res.status(200).json({ error: false, response: data })
                }
            })
        }
    )

    const route_id = app.route('/users/:id')

    route_id.get((req, res) => {
        database.findOne({

            _id: req.params.id

        }).exec((error, data) => {
            if (error)
            {
                app.utils.error.send(error, req, res)
            }
            else
            {
                res.status(200).json({ error: false, response: data })
            }
        })
    })

    route_id.put(
        [
            check ('first_name', 'O nome é requerido').notEmpty(),
            check ('first_name', 'O nome precisa ter no mínimo 3 letras').isLength({ min: 3 }),
            check ('last_name', 'O sobrenome é requerido').notEmpty(),
            check ('last_name', 'O sobrenome precisa ter no mínimo 3 letras').isLength({ min: 3 }),
            check ('email', 'O e-mail é requerido').notEmpty(),
            check ('email', 'O e-mail esta inválido').isEmail(),
        ],
        (req, res) => {

            let errors = validationResult(req)

            if ( ! errors.isEmpty() )
            {
                return res.status(422).json({ error: true, response: errors })

                return false
            }


            database.update({ _id: req.params.id }, req.body, (error) => {
                if (error)
                {
                    app.utils.error.send(error, req, res)
                }
                else
                {
                    res.status(200).json({ error: false, response: Object.assign(req.params, req.body) })
                }
            })
        }
    )

    route_id.delete((req, res) => {
        database.remove({ _id: req.params.id }, {}, (error) => {

            if (error)
            {
                app.utils.error.send(error, req, res)
            }
            else
            {
                res.status(200).json({ error: false, response: req.params })
            }
        })
    })
}