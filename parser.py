f = open("example.txt")
lines = f.readlines()
i = 0
varStartEnd = [0, 0]
functionName = ""
body = ""
for line in lines:
    if (line[2] == "*"):
        varStartEnd[1] = i-1
        body = lines[i+1]
    if (line[1] == "*" and line[2] != "*"):
        varStartEnd[0] = i+1
    if (line[0] == "*" and line[1] != "*"):
        functionName = line[1:-2]
        if (len(functionName.split(" ")) > 1):
            print("ERROR: a function's name cannot contain spaces\nLine:{}".format(i+1))
            exit(1)
    i += 1
variablesLines = lines[varStartEnd[0]:varStartEnd[1]]
variables = {}
for line in variablesLines:
    varInfo = line.split('=')
    variables[varInfo[0]] = varInfo[1].strip("\n")
print(variables)
print(body)
print(functionName)
i = 0
bodyBuilt = []
buildingIf = ""
buildIf = False
for char in body:
    if (buildIf and char != ")" and char != "]"):
        if (char in variables.keys()):
            buildingIf += variables[char]
        else:
            buildingIf += char
        i += 1
        continue
    if (char == "<"):
        print("<", i)
        if (body[i + 1] == "-"):
            print("endWhile", i)
            bodyBuilt.append(["Endwhile"]) 
        elif(buildIf):
            buildingIf += "<"
        
    elif (char == ">"):
        pass
    elif (char == "="):
        pass
    elif (char == "-"):
        pass
    elif (char == "+"):
        pass
    elif (char == ":"):
        bodyBuilt.append(["call", variables[body[i-1]], variables[body[i+1]]])
    elif (char == ")"):
        if (body[i-1] == "]"):
            bodyBuilt.append(["startWhile", buildingIf]) 
        else:
            bodyBuilt.append(["endIf", buildingIf])
        buildingIf = ""
        buildIf = False
    elif (char == "("):
        if (body[i+1] == "["):
            i += 1
            continue
        bodyBuilt.append(["startIf"])
        buildIf = True
    elif (char == "]"):
        buildIf = False
    elif (char == "["):
        buildIf = True
    else:
        pass
    i += 1
print(bodyBuilt)
bodyInJs = ""
ifs = 1
bodyInJs += "function {} (input) {{\n".format(functionName)
currentIndentation = 1
for part in bodyBuilt:
    if (part[0] == "startWhile"):
        bodyInJs += "  "*currentIndentation + "while ({}) {{\n".format(part[1])
        currentIndentation += 1
    elif (part[0] == "endWhile"):
        currentIndentation -= 1
        bodyInJs += "  "*currentIndentation + "\n}"
    elif (part[0] == "startIf"):
        bodyInJs += "  "*currentIndentation + "if "
    elif (part[0] == "endIf"):
        bodyInJs += "({}) {{\n".format(part[1])
        currentIndentation += 1
        ifs += 1
    elif (part[0] == "call"):
        bodyInJs += "  "*currentIndentation + "{}({})\n".format(part[1], part[2])
for x in range(ifs):
    currentIndentation -= 1
    bodyInJs += "  "*currentIndentation + "}\n"
f.close()
f2 = open("out.js", "w")
bodyInJs += "}"
f2.write(bodyInJs)