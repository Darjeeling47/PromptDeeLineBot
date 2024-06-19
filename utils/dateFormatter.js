const dateFormatter = (date) => {
  const newDate = new Date(date)

  const result = newDate.toLocaleDateString("th-TH")

  return result
}

module.exports = { dateFormatter }
