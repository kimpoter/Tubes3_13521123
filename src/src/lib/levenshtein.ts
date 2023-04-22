/**
 * Calculate match percentage between two string using normalized levenshtein algorithm
 *
 * @param s_pattern Pattern string
 * @param s_target Target string
 * @returns Match percentage of pattern and target string
 */
export function levenshtein(s_pattern: string, s_target: string): number {
  let operations_table: number[][] = new Array(s_target.length + 1);
  for (let i = 0; i < operations_table.length; i++) {
    operations_table[i] = new Array(s_pattern.length + 1);
  }

  for (let i = 0; i < operations_table.length; i++) {
    operations_table[i][0] = i;
  }

  for (let i = 0; i < operations_table[0].length; i++) {
    operations_table[0][i] = i;
  }

  for (let row = 1; row < operations_table.length; row++) {
    for (let col = 1; col < operations_table[0].length; col++) {
      if (s_pattern[col - 1] === s_target[row - 1]) {
        operations_table[row][col] = operations_table[row - 1][col - 1];
      } else {
        operations_table[row][col] =
          Math.min(
            operations_table[row - 1][col],
            operations_table[row][col - 1],
            operations_table[row - 1][col - 1]
          ) + 1;
      }
    }
  }

  return (
    (1 -
      operations_table[s_target.length][s_pattern.length] /
        Math.max(s_pattern.length, s_target.length)) *
    100
  );
}
