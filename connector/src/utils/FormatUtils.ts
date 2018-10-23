export function toNoMilliISOString(d: Date): string {
    let res: string = "";
    if (d && d instanceof Date) {
        res = d.toISOString().split('.')[0] + "Z";
    }
    return res;
}
