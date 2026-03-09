export function formatKw(value: number) {
    return `${value.toLocaleString("da-DK", { maximumFractionDigits: 0 })} kW`;
}