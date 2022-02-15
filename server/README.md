# notp api server

## Confing:
Fill and rename config.example.json to config.json.  
The fields are:
```JSON
{
  "calendarUrl" : "", // url of the calendar to fetch
  "roomsList" : [""], // list of all the rooms to track (must correspond to the calendar data)
  "slotDuration" : 1, // duration of a time slot (hours)
  "refreshRate" : 10 // api data refresh rate (minutes)
}
```

## Build:
`docker build . -t nohehf/notp-server`

Mac os:
`docker buildx build --platform linux/amd64,linux/arm64 --push -t harbor.k8s.inpt.fr/net7/notp:2.0.3 .`
## Run:
`docker run -p 3000:8080 -d nohehf/notp-server`
