const l = console.log

const ops = {
    ADD: '+',
    SUB: '-',
    MUL: '*',
    DIV: '/',
    EQ: "==",
    EEQ: "==="
}

let globalScope = new Map()

class Visitor {    

    constructor(buffer) {
        this.buffer = buffer;
    }

    visitVariableDeclaration(node) {
        const nodeKind = node.kind
        return this.visitNodes(node.declarations)
    }    
    
    visitVariableDeclarator(node) {
        const id = this.visitNode(node.id)
        const init = this.visitNode(node.init)
        globalScope.set(id, init)
        return init
    }    
    
    visitIdentifier(node) {
        const name = node.name
        if (globalScope.get(name))
            return globalScope.get(name)
        else
            return name
    }    
    
    visitLiteral(node) {
        return node.raw
    }    
    
    visitBinaryExpression(node) {
        const leftNode = this.visitNode(node.left)
        const operator = node.operator
        const rightNode = this.visitNode(node.right)        

        var leftValue;
        var rightValue;

        leftValue = eval(leftNode)
        rightValue = eval(rightNode)

        switch (operator) {
            case ops.ADD:
                return leftNode + rightNode
            case ops.SUB:
                return leftNode - rightNode
            case ops.DIV:
                return leftNode / rightNode
            case ops.MUL:
                //l("MUL",leftNode,"*",rightNode,"=",(leftNode * rightNode))
                return leftNode * rightNode
            case ops.EQ:
                l(this.buffer.substring(node.start,node.end))
                l(typeof(leftValue),typeof(rightValue))
                l(leftValue,rightValue)
                l(leftValue==rightValue)
                
                return (leftValue == rightValue)
            default:
                l(node)
        }
    }    
    
    evalArgs(nodeArgs) {
        let g = []
        for (const nodeArg of nodeArgs) {
            g.push(this.visitNode(nodeArg))
        }
        return g
    }    
    
    visitCallExpression(node) {
        if(node.expression.type === "CallExpression"){
            //l(node)
            const callee = this.visitIdentifier(node.expression.callee)
            const _arguments = this.evalArgs(node.expression.arguments)        
            if (callee == "print"){
                l(..._arguments)
            }
        }
        
    }    
    
    visitNodes(nodes) {
        for (const node of nodes) {
            this.visitNode(node)
        }
    }    
    
    visitNode(node) {
        switch (node.type) {
            case 'VariableDeclaration':
                return this.visitVariableDeclaration(node)
            case 'VariableDeclarator':
                return this.visitVariableDeclarator(node)
            case 'Literal':
                return this.visitLiteral(node)
            case 'Identifier':
                return this.visitIdentifier(node)
            case 'BinaryExpression':
                return this.visitBinaryExpression(node)
            case "ExpressionStatement":
                return this.visitCallExpression(node)
        }
    }    
    
    run(nodes) {
        return this.visitNodes(nodes)
    }
}

module.exports = Visitor