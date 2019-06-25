export default class Tokenizer {
    constructor() {

    }
    tokenizeFunctions(funcList) {
        let newFuncList = []
        funcList.forEach(func => {
            let body = this.tokenize(func.body)
            newFuncList.push({name:func.name, variables: func.variables, body:body})
        })
        return newFuncList
    }
    tokenize(body) {
        this.tokenList = []
        this.memory = {}
        this.memory.string = ""
        body.split("").forEach(char => {
            if (this.memory.inString) {
                if (this.memory.string !== "" && char === "\"") {
                    this.memory.string += "\""
                    this.tokenList.push(["str", this.memory.string])
                    this.memory.inString = false
                    return
                } else {
                    this.memory.string += char
                    return
                }
            }
            switch (char) {
                case ";":
                    this.updateNumber()
                    this.tokenList.push(["id", "if"])
                    break
                case "!":
                    this.updateNumber()
                    this.tokenList.push(["else", "else"])
                    break
                case "|":
                    this.updateNumber()
                    this.tokenList.push(["id", "while"])
                    break
                case "^":
                    this.updateNumber()
                    this.tokenList.push(["end", "end"])
                    break
                case ":":
                    this.updateNumber()
                    this.tokenList.push(["startCall", "startCall"])
                    break
                case "{":
                    this.updateNumber()
                    this.tokenList.push(["startAssign", "startAssign"])
                    break
                case "}":
                    this.updateNumber()
                    this.tokenList.push(["endAssign", "endAssign"])
                    break
                case ".":
                    this.updateNumber()
                    this.tokenList.push(["endCall", "endCall"])
                    break
                case "\"":
                    if (this.memory.string !== "" && this.memory.string !== undefined) {
                        this.tokenList.push(["str", this.memory.string])
                    } else {
                        this.memory.string += "\""
                        this.memory.inString = true
                    }
                    break
                default:
                    if (char.match(/[A-z]/)) {
                        this.tokenList.push(["variable", char])
                        this.updateNumber()
                    } else if (char.match(/[1-9]/)) {
                        this.memory.number += char
                    } else if (char.match(/[<>!]|(==)/)) {
                        this.tokenList.push(["compare", char])
                    } else if (char.match(/[+\-\*\\]/)) {
                        this.tokenList.push(["op", char])
                    }
            }
        });
        return this.tokenList
    }
    updateNumber() {
        if (this.memory.number !== "" && this.memory.number != undefined) {
            this.tokenList.push(["num", this.memory.number])
        }
        this.memory.number = ""
    }
}