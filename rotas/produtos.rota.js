const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const produtoMid = require('../middleware/validarProduto.middleware')
const produtoSchema = require('../schemas/produto.schema')

const produtos = {}

router.post('/', produtoMid)
router.put('/', produtoMid)

router.get('/:id', (req, res) => {
    res.json({ produtos: produtos[req.params.id] })
})

router.put('/', (req, res) => {
    const id = req.query.id
    if (id && produtos[id]) {
        const produto = req.body
        produto.id = id
        produtos[id] = produto
        res.json({ msg: "Produto atualizado com sucesso!" })
    } else {
        res.status(400).json({ msg: "Produto não encontrado!" })
    }
})

router.delete('/', (req, res) => {
    const id = req.query.id
    if (id && produtos[id]) {
        delete produtos[id]
        res.json({ msg: "Produto deletado com sucesso!" })
    } else {
        res.status(400).json({ msg: "Produto não encontrado!" })
    }
})

router.post('/', (req, res) => {
    const produto = req.body
    const Ajv = require('ajv')
    const ajv = new Ajv()
    const addFormats = require("ajv-formats")
    addFormats(ajv)
    const validate = ajv.compile(produtoSchema)
    const valid = validate(produto)

    if (valid) {
        const idproduto = uuidv4()
        produto.id = idproduto
        produtos[idproduto] = produto
        res.json({ msg: "Produto adicionado com sucesso!" })
    } else {
        res.status(400).json({ msg: "Dados inválidos", errors: validate.errors })
    }
})

router.get('/', (req, res) => {
    res.json({ produtos: Object.values(produtos) })
})

module.exports = router