// src/index.js
const l = console.log
const acorn = require('acorn')
const Interpreter = require("./interpreter.js")
const Visitor = require("./visitor.js")
const fs = require('fs')// pull in the cmd line args

const args = process.argv[2]
const buffer = fs.readFileSync(args).toString()
const jsInterpreter = new Interpreter(new Visitor(buffer))

const body = acorn.parse(buffer,{
    ecmaVersion: "latest"
}).body

jsInterpreter.interpret(body)