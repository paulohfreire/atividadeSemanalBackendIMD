module.exports = {
  type: "object",
  properties: {
    nome: { type: "string" },
    descricao: { type: "string" },
    preco: { type: "number" },
    tag: { type: "string" }
  },
  required: ["nome", "preco"],
  additionalProperties: true
}