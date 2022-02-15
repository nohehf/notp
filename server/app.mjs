import fs from 'fs'
import ical from 'node-ical'
import express from 'express'
import cors from 'cors'

const config = JSON.parse(fs.readFileSync('config.json'))
console.log('lodaded config: ', config)

const initResults = {
  usedNow: [],
  usedAfter: [],
  freeNow: [...config.roomsList],
  freeAfter: [...config.roomsList],
  startDate: null,
  startDateAfter: null,
  allRooms: config.roomsList,
  lastUpdate: null,
  nextUpdate: null,
  version: config.version,
}
let results = {
  usedNow: [], // rooms curenty used
  usedAfter: [], // rooms used during next time slot
  freeNow: [...config.roomsList], // rooms curently free
  freeAfter: [...config.roomsList], // free rooms during next time slot
  startDate: null, // current time slot starting date
  startDateAfter: null, // next time slot starting date
  allRooms: config.roomsList, // all the tracked rooms
  lastUpdate: null, // date of the last data update,
  nextUpdate: null, // date of the next update
  version: config.version,
}

setInterval(updateData, config.refreshRate * 60 * 1000)

const app = express()
app.use(cors())
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

// builds the free list depending on the used list
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
  results.usedNow = []
  results.usedAfter = []
  results.freeNow = [...config.roomsList]
  results.freeAfter = [...config.roomsList]
  const startDate = new Date(Date.now())

  const startDateAfter = addHoursToDate(startDate, config.slotDuration)

  results.startDate = startDate
  results.startDateAfter = startDateAfter

  ical.fromURL(config.calendarUrl, {}, (err, data) => {
    if (err) console.log(err)
    for (const k in data) {
      if (!Object.prototype.hasOwnProperty.call(data, k)) continue
      const event = data[k]

      if (Object.hasOwnProperty.call(event, 'start') && Object.hasOwnProperty.call(event, 'end')) {
        const isNow = dateIsBetween(startDate, new Date(event.start), new Date(event.end))
        const isAfter = dateIsBetween(startDateAfter, new Date(event.start), new Date(event.end))
        if (isNow)
          results.usedNow.push(event.location.split(','))

        if (isAfter)
          results.usedAfter.push(event.location.split(','))

        if (!(isNow || isAfter)) continue
      }
    }
    results.usedNow = results.usedNow.flat()
    results.usedAfter = results.usedAfter.flat()
    results.lastUpdate = startDate
    const nextUpdateMs = Number(startDate) + config.refreshRate * 60 * 1000
    results.nextUpdate = new Date(nextUpdateMs)

    filterResults(results.freeNow, results.usedNow)
    filterResults(results.freeAfter, results.usedAfter)
    console.log(results)
  })
}
