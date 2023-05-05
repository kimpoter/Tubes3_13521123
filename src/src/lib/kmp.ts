function kmpMatch(s: String, pattern: String) {
    if (s.length != pattern.length) {
        return false;
    }
    const lps = computeLPS(pattern);
    let i = 0;
    let j = 0;

    while (i < s.length) {
        if (s[i] === pattern[j]) {
            i++;
            j++;
        }

        if (j === pattern.length) {
            return true;
        } else if (i < s.length && s[i] !== pattern[j]) {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }

    return false;
}

function computeLPS(pattern: String) {
    const lps = new Array(pattern.length).fill(0);
    let len = 0;
    let i = 1;

    while (i < pattern.length) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }

    return lps;
}

export { kmpMatch };
