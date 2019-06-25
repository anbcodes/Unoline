import Reader from "./Reader.mjs"
import Tokenizer from "./Tokenizer.mjs"
import Parser from "./Parser.mjs"
import Transpiler from "./Transpiler.mjs"
import fs from "fs"
class Main {
    constructor() {
        this.reader = new Reader()
        this.functions = this.reader.read(process.argv[2])
        this.tokenizer = new Tokenizer()
        this.functions = this.tokenizer.tokenizeFunctions(this.functions)
        this.parser = new Parser()
        this.functions = this.parser.parseFunctions(this.functions)
        this.transpiler = new Transpiler()
        this.jsFile = this.transpiler.transpileFunctions(this.functions)
        fs.writeFile(process.argv[3], this.jsFile, () => {console.log("Done!")})
    }
}
new Main()