function Print_Numbers_Up_To (input) {
  let C = console.log
  let E = "Error: number to big"
  let N = input[0]
  let T = 1000
  let B = 0
  let I = 1
  if (N<T) {
    while (B<N) {
      C(B)
      B = B+I
    }
  } else {
    C(E)
  }
}
Print_Numbers_Up_To([200])