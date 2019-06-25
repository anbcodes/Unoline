function main(input) {
  let R
  let C = console.log
  let E = "Error: number to big"
  let M = "To your number"
  let N = input
  let T = 100
  let b = 0
  let I = 1
  if (N<T) {
    while (b<N) {
      b += 1
    }
  }
  else {
    C("Error: To Big")
  }
  return R
}
main(process.argv[2])