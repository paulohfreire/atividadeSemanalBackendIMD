const express = require('express')
const router = express.Router()
const produtoMid = require('../middleware/validarProduto.middleware')
const { Produto } = require('../models')
var multer = require('multer')
const path = require('path')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    const extensoes = /jpeg|png|jpg/i
    if (extensoes.test(path.extname(file.originalname))) {
        cb(null, true)
    } else {
        return cb('Arquivo não suportado. Apenas jpg, png e jpeg são suportados.')
    }
}

var upload = multer({ storage: storage, fileFilter: fileFilter })

router.post('/', upload.single('foto'))
router.post('/', produtoMid)
router.put('/', produtoMid)

router.get('/', async (req, res) => {
    const produtos = await Produto.findAll()
    res.json({ produtos: produtos })
})

router.get('/:id', async (req, res) => {
    const produto = await Produto.findByPk(req.params.id)
    res.json({ produtos: produto })
})

// foto é o campo do formulário do html
router.post('/:id/upload', upload.single('foto'), async (req, res) => {
    console.log(req.file)
    res.json({ msg: 'Arquivo enviado com sucesso.' })

    const id = req.params.id
    const produto = await Produto.findByPk(id)

    if (produto) {
        produto.foto = `/static/uploads/${req.file.filename}`
        await produto.save()
        res.json({ msg: "Upload de foto realizado com sucesso!" })
    } else {
        res.status(400).json({ msg: "Upload não realizado!" })
    }

})

router.post('/', async (req, res) => {
    const data = req.body
    if (req.file) {
        data.foto = `/static/uploads/${req.file.filename}`
    }
    const produto = await Produto.create(data)
    res.json({ msg: "Produto adicionado com sucesso!" })
})

router.delete('/', async (req, res) => {
    const id = req.query.id
    const produto = await Produto.findByPk(id)

    if (produto) {
        await produto.destroy()
        res.json({ msg: "Produto excluído com sucesso." })
    } else {
        res.status(400).json({ msg: "Produto não encontrado." })
    }
})

router.put('/', async (req, res) => {
    const id = req.query.id
    const produto = await Produto.findByPk(id)

    if (produto) {
        produto.nome = req.body.nome
        produto.descricao = req.body.descricao
        produto.valor = req.body.valor
        await produto.save()
        res.json({ msg: "Produto atualizado com sucesso!" })
    } else {
        res.status(400).json({ msg: "Produto não encontrado!" })
    }
})

module.exports = router