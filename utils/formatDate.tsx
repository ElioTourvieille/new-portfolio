import { DateField } from "@prismicio/client";

export function formatDate(dateStr: DateField): string {
    if (!dateStr) return "";
    const date = new Date(dateStr);

    // Options for formatting
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    // Format the date
    let formattedDate = new Intl.DateTimeFormat("fr-fr", options).format(date);

    // Make the first letter of the weekday uppercase
    formattedDate = formattedDate.charAt(0).toLocaleUpperCase() + formattedDate.slice(1);

    return formattedDate;
}