module.exports = {
  type: "object",
  properties: {
    nome: { type: "string" },
    descricao: { type: "string" },
    preco: { type: "number" }
  },
  required: ["nome", "preco"],
  additionalProperties: false
}