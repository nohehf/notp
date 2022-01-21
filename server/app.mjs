import ical from 'node-ical'

// faire tourner ça toutes les 30 minutes

import express from 'express'
import cors from 'cors'
const allRooms = ['C201', 'C202', 'C203', 'C204', 'C205', 'C206', 'C209', 'C302', 'C303', 'C304', 'C305', 'C306', 'C308', 'C309', 'C310']
const calUrl = process.env.CALURL
const initResults = {
  usedNow: [],
  usedAfter: [],
  freeNow: [...allRooms],
  freeAfter: [...allRooms],
  startDate: null,
  startDateAfter: null,
  allRooms,
  lastUpdate: new Date(Date.now()).toUTCString(),
}
let results = {
  usedNow: [],
  usedAfter: [],
  freeNow: [...allRooms],
  freeAfter: [...allRooms],
  startDate: null,
  startDateAfter: null,
  allRooms,
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
  results = { ...initResults }
  const startDate = new Date(Date.now())

  const startDateAfter = addHoursToDate(startDate, 2)

  results.startDate = startDate
  results.startDateAfter = startDateAfter

  ical.fromURL(calUrl, {}, (err, data) => {
    if (err) console.log(err)
    for (const k in data) {
      if (!Object.prototype.hasOwnProperty.call(data, k)) continue
      const event = data[k]

      if (Object.hasOwnProperty.call(event, 'start') && Object.hasOwnProperty.call(event, 'end')) {
        const isNow = dateIsBetween(startDate, new Date(event.start), new Date(event.end))
        const isAfter = dateIsBetween(startDateAfter, new Date(event.start), new Date(event.end))
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
    results.lastUpdate = startDate

    filterResults(results.freeNow, results.usedNow)
    filterResults(results.freeAfter, results.usedAfter)
    console.log(results)
  })
}
