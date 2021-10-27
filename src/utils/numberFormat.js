import BigNumber from 'bignumber.js'

export const formatBigNumber = (num) => {
    return new Number(num).toLocaleString("en-US", { maximumFractionDigits: 20 })
}

export const formatDecimalNumber = (value) => {
    const oldValue = new BigNumber(value);
    if (oldValue.multipliedBy(100).abs() >= 1) {
        return oldValue.toFixed(2, 1);
    }
    else if (oldValue.multipliedBy(100).abs() < 1 && oldValue.multipliedBy(10000).abs() >= 1) {
        return oldValue.toFixed(4, 1);
    }
    else {
        return oldValue.toString(10);
    }
}

export const formatBigNumberWithDecimals = (bigNumber, decimals, decimalPlace, toLocaleString) => {
    if (!bigNumber) {
        return
    }

    let dot = decimalPlace
    // if (process.env.NODE_ENV === "development") {
    //     dot = null
    // }

    if ((typeof bigNumber) === "number" || (typeof bigNumber) === "string") {
        const n = new BigNumber(bigNumber).dividedBy(new BigNumber(10).pow(decimals))
        if (toLocaleString) {
            return n.toNumber().toLocaleString()
        } else {
            return n.toFixed(dot)
        }
    }

    const n = bigNumber.dividedBy(new BigNumber(10).pow(decimals))
    if (toLocaleString) {
        return n.toNumber().toLocaleString()
    } else {
        return n.toFixed(dot)
    }
}

