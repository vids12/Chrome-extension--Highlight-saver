export const formatRelativeTime = (date) => {
  const now = new Date().toLocaleString();
  const diff = Math.floor((Date.parse(now) - Date.parse(date)) / 1000);
  if (diff < 60) return `${diff} ${diff === 1 ? "second" : "seconds"} ago`;
  else if (diff < 3600)
    return `${Math.floor(diff / 60)} ${
      Math.floor(diff / 60) === 1 ? "minute" : "minutes"
    } ago`;
  else if (diff < 86400)
    return `${Math.floor(diff / 3600)} ${
      Math.floor(diff / 3600) === 1 ? "hour" : "hours"
    } ago`;
  else
    return `${Math.floor(diff / 86400)} ${
      Math.floor(diff / 86400) === 1 ? "day" : "days"
    } ago`;
};
