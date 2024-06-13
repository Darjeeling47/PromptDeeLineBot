const dateFormatter = (date) => {
  const newDate = new Date(date)

  const result = newDate.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })

  return result
}

module.exports = { dateFormatter }
