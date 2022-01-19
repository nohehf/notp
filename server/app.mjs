import ical from 'node-ical'

// faire tourner ça toutes les 30 minutes

import express from 'express'
import cors from 'cors'
const allRooms = ['C201', 'C202', 'C203', 'C204', 'C205', 'C206', 'C209', 'C302', 'C303', 'C304', 'C305', 'C306', 'C308', 'C309', 'C310']
const calUrl = 'https://edt.inp-toulouse.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319&projectId=35&calType=ical&firstDate=2021-08-01&lastDate=2022-07-15'

const results = {
  usedNow: [],
  usedAfter: [],
  freeNow: [...allRooms],
  freeAfter: [...allRooms],
  lastUpdate: new Date(Date.now()).toUTCString(),
}

const REFRESH_RATE = 10 * 60 * 1000 // 10 minutes

setInterval(updateData, REFRESH_RATE)

const app = express()
app.use(cors())
// app.use(express.json())
const PORT = 8080
const HOST = '0.0.0.0'

app.get('/', (req, res) => {
  res.json(results)
})

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`)
})

updateData()

function addHoursToDate(date, hours) {
  return new Date(new Date(date).setHours(date.getHours() + hours))
}

function dateIsBetween(date, start, end) {
  return (date >= start && date <= end)
}

function filterResults(free, used) {
  for (const value of used) {
    console.log(value)
    const index = free.indexOf(value)
    if (index !== -1)
      free.splice(index, 1)
  }
}

function updateData() {
  const startDate = new Date(Date.now())
  const endDate = addHoursToDate(startDate, 1)

  const startDateAfter = addHoursToDate(startDate, 2)
  const endDateAfter = addHoursToDate(endDate, 2)

  ical.fromURL(calUrl, {}, (err, data) => {
    if (err) console.log(err)
    for (const k in data) {
      if (!Object.prototype.hasOwnProperty.call(data, k)) continue
      const event = data[k]

      if (Object.hasOwnProperty.call(event, 'start') && Object.hasOwnProperty.call(event, 'end')) {
        const isNow = dateIsBetween(new Date(event.start), startDate, endDate)
        const isAfter = dateIsBetween(new Date(event.start), startDateAfter, endDateAfter)
        if (isNow)
          results.usedNow.push(event.location.split(','))

        if (isAfter) {
          addHoursToDate(startDate, 1)
          results.usedAfter.push(event.location.split(','))
        }

        if (!(isNow || isAfter)) continue
      }
    }
    results.usedNow = results.usedNow.flat()
    results.usedAfter = results.usedAfter.flat()
    results.lastUpdate = startDate.toUTCString()

    filterResults(results.freeNow, results.usedNow)
    filterResults(results.freeAfter, results.usedAfter)
    console.log(results)
  })
}
