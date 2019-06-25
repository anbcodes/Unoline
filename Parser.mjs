export default class Parser {
    constructor() {

    }
    parseFunctions(functions) {
        let newFuncList = []
        functions.forEach(func => {
            let body = this.parse(func.body)
            newFuncList.push({name:func.name, variables: func.variables, body:body})
        })
        return newFuncList
    }
    parse(tokens) {
        let i = 0
        let steps = []
        this.tokens = tokens
        this.keys = this.getTokenKeys()
        this.values = this.getTokenValues()
        for (let i = 0; i < this.tokens.length; i++) {
            let token = this.tokens[i]
            console.log(token)
            switch (token[0]) {
                case "variable":
                    if (this.tokens[i+1][1] === "startAssign") {
                        if (this.tokens[i+2][0] === "op") {
                            let ex = this.till("endAssign", i+3)
                            steps.push(["assign", token[1], `${this.tokens[i+2][1]}= ${ex}`])
                            i = this.keys.indexOf("endAssign", i)
                        } else {
                            let ex = this.till("endAssign", i+2)
                            i = this.keys.indexOf("endAssign", i)
                            steps.push(["assign", token[1], `= ${ex}`])
                        }
                    } else if (this.tokens[i+1][0] === "startCall") {
                        let args = this.tillNoJoin("endCall", i+2)
                        i = this.keys.indexOf("endCall", i)
                        steps.push(["call", token[1], args])
                    } else {
                        let ex = this.till("id", i)
                        let type = this.tokens[this.keys.indexOf("id", i)][1]
                        steps.push([type, ex])
                        i = this.keys.indexOf("id", i)
                    }
                    break
                case "end":
                    steps.push(["end"])
                    break
                case "else":
                    steps.push(["else"])
                    break
            }
        }
        return steps
            
    }
    till(key, index) {
        let ex = this.keys.indexOf(key, index)
        return this.values.slice(index, ex).join("")
    }
    tillNoJoin(key, index) {
        let ex = this.keys.indexOf(key, index)
        return this.values.slice(index, ex)
    }
    getTokenKeys() {
        let keys = []
        this.tokens.forEach(token => {
            keys.push(token[0])
        })
        return keys
    }
    getTokenValues() {
        let values = []
        this.tokens.forEach(token => {
            values.push(token[1])
        })
        return values
    }
}