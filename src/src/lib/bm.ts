function bmMatch(str1: String, str2: String) {
    if (str1.length != str2.length) {
        return false;
    }

    const charTable: { [key: string]: number } = {};
    const strLen = str2.length;

    // Build character table for pattern string
    for (let i = 0; i < strLen; i++) {
        charTable[str2.charAt(i)] = i;
    }

    const matchLen = strLen;
    let index = strLen - 1;

    while (index < str1.length) {
        let matchIndex = matchLen - 1;

        while (str1.charAt(index) === str2.charAt(matchIndex)) {
            if (matchIndex === 0) {
                return true; // Match found
            }

            index--;
            matchIndex--;
        }

        index += Math.max(
            matchLen - matchIndex,
            charTable[str1.charAt(index)] || matchLen
        );
    }

    return false; // No match found
}
// console.log(bmMatch("a", ""));
// console.log(bmMatch("ab", "a"));
// console.log(bmMatch("abc d", "abc d"));
export { bmMatch };
