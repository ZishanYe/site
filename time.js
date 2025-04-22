function righttime(d, timeslots) {
    const entries = timeslots.split(',').map(entry => entry.trim()).filter(entry => entry !== '');

    for (const entry of entries) {
        const strippedEntry = entry.replace(/\s+/g, '');
        let wsEnd = 0;
        while (wsEnd < strippedEntry.length && /^[A-Za-z]$/.test(strippedEntry[wsEnd])) {
            wsEnd++;
        }
        const wsStr = strippedEntry.slice(0, wsEnd).toUpperCase();
        const timePart = strippedEntry.slice(wsEnd);
        const days = [];
        for (const char of wsStr) {
            switch (char) {
                case 'M': days.push(1); break;
                case 'T': days.push(2); break;
                case 'W': days.push(3); break;
                case 'R': days.push(4); break;
                case 'F': days.push(5); break;
                case 'S': days.push(6); break;
                case 'U': days.push(0); break;
                default: break;
            }
        }
        if (days.length === 0) continue;
        const currentDay = d.getDay();

        if (!days.includes(currentDay)) continue;

        const timeParts = timePart.split('-');
        if (timeParts.length !== 2) continue;

        const [startStr, endStr] = timeParts;
        const start = parseTime(startStr);
        const end = parseTime(endStr);
        if (!start || !end) continue;

        const currentHours = d.getHours();
        const currentMinutes = d.getMinutes();
        const currentTotal = currentHours * 60 + currentMinutes;
        const startTotal = start.hours * 60 + start.minutes;
        const endTotal = end.hours * 60 + end.minutes;

        if (currentTotal >= startTotal && currentTotal <= endTotal) {
            return true;
        }
    }
    return false;
}
function parseTime(timeStr) {
    const parts = timeStr.split(':');
    if (parts.length < 2) return null;

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (isNaN(hours) || isNaN(minutes)) return null;
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

    return { hours, minutes };
}