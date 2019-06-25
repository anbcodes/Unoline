export default class Transpiler {
    constructor() {

    }
    transpileFunctions(functions) {
        this.jsFile = ""
        functions.forEach(func => {
            this.transpile(func)
        });
        return this.jsFile
    }
    addToFunction(message) {
        this.jsFunction += '  '.repeat(this.indentLevel) + message
    }
    transpile(func) {
        this.args = this.getArgs(func)
        this.indentLevel = 1
        this.jsFunction = `function ${func.name}(${this.args.join(", ")}) {\n`
        this.jsFunction += `  let R\n`
        console.log(func)
        func.variables.forEach(variable => {
            this.addToFunction(`let ${variable[0]} = ${variable[1]}\n`)
        })
        func.body.forEach(part => {
            switch (part[0]) {
                case "if":
                    this.addToFunction(`if (${part[1]}) {\n`)
                    this.indentLevel += 1
                    break
                case "while":
                    this.addToFunction(`while (${part[1]}) {\n`)
                    this.indentLevel += 1
                    break
                case "else":
                    this.addToFunction(`else {\n`)
                    this.indentLevel += 1
                    break
                case "end":
                    this.indentLevel -= 1
                    this.addToFunction(`}\n`)
                    break
                case "call":
                    this.addToFunction(`${part[1]}(${part[2].join(", ")})\n`)
                    break
                case "assign":
                    this.addToFunction(`${part[1]} ${part[2]}\n`)
            }
        })
        this.jsFunction += `  return R\n}\n`
        this.jsFile += this.jsFunction
        let processArgs = []
        for (let x = 0; x < this.args.length; x++) {
            processArgs.push(`process.argv[${x+2}]`)
        }
        if (func.name === "main") {
            this.jsFile += `main(${processArgs.join(", ")})`
        }
    }
    getArgs(func) {
        let args = []
        let i = 0
        func.variables = func.variables.slice(0, -1)
        console.log(func.variables)
        func.variables.forEach(variable => {
            if (variable[0] === "R") {
                console.log("ERROR: R is a reserved variable for returning")
            }
            if (variable[1][0] === "{") {
                func.variables[i][1] = variable[1].replace("}", "").replace("{", "")
                args.push(func.variables[i][1])
            }
            i++
        })
        return args
    }
}