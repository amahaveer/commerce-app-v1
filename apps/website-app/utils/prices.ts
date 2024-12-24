export function getFormattedPrice(price: number, fraction: number): number {
    const divider = 10 ** fraction
    return parseFloat((price / divider).toFixed(fraction))
}