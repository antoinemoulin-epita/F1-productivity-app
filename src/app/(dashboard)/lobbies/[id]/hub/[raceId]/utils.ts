export function getTimeRemaining(endsAt: string) {
    const now = new Date();
    const end = new Date(endsAt);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return { display: "Terminé", days: 0, hours: 0, minutes: 0, seconds: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let display = "";
    if (days > 0) display = `${days}j ${hours}h`;
    else if (hours > 0) display = `${hours}h ${minutes}m`;
    else display = `${minutes}m ${seconds}s`;

    return { display, days, hours, minutes, seconds };
}