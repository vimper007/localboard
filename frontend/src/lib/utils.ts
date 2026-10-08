export { cn } from "cn"

export function capitaliseStatus(status: string) {
    return status.split('-').map(word => `${word.charAt(0).toUpperCase()}`)
}