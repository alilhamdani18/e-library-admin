const getDateString = (timestamp) => {
  if (!timestamp?._seconds) return "-";
  const date = new Date(timestamp._seconds * 1000);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default getDateString;