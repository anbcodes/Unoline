import fs from "fs"
export default class Reader {
    constructor() {

    }
    read(fileName) {
        this.file = fs.readFileSync(fileName)
        let functionRe = /(?<=\*)(.*)[^\*](?=(\*[^\*]))/g
        let varRe = /(?<=[^\*]\*\*[^\*](.*)\n)((.|\n)*?)(?=\*\*\*)/gm
        let bodyRe = /(?<=\*\*\*(.*)\n)(.*)(?=[\n])/gm
        this.file += "\n"

        this.functionNames = []
        this.variables = []
        this.bodies = []
        this.results = []
        let m
        do {
            m = functionRe.exec(this.file);
            if (m) {
                // console.log(m);
                this.functionNames.push(m[0])
            }
        } while (m);
        do {
            m = varRe.exec(this.file);
            if (m) {
                // console.log(m);
                this.variables.push(m[0].split("\n"))
            }
        } while (m);
        do {
            m = bodyRe.exec(this.file);
            if (m) {
                // console.log(m);
                this.bodies.push(m[0])
            }
        } while (m);
        this.convertToFunctions()
        return this.functions
    }
    convertToFunctions() {
        this.functions = []
        this.currentFunction = {}
        for (let i = 0; i < this.functionNames.length; i++) {
            this.currentFunction.name = this.functionNames[i]
            this.currentFunction.variables = this.convertVariables(this.variables[i])
            this.currentFunction.body = this.bodies[i]
            this.functions.push(this.currentFunction)
        }
    }
    convertVariables(variables) {
        let newVars = []
        variables.forEach(variable => {
            newVars.push(variable.split("="))
        })
        return newVars
    }
}