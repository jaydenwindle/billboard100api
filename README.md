Billboard Top 100 API
=====================

This is a simple API which allows you to grab the Billboard #1 song(s) for any date (since 1959). 

API Usage
=========

```
// Get a list of all #1 songs in a given year
GET /:year

// Returns:
[
  {
    "name": "Name of hit song",
    "artist": "Name of Artist",
    "startDate": "(first day on chart, in UTC)",
    "endDate": "(last day on chart, in UTC)"
  },
  ...
]
```
<a href="https://billboard100api.glitch.me/1969">Example (GET /1969)</a>

---
```
// Get a list of all #1 songs in a given month
GET /:year/:month

// Returns:
[
  {
    "name": "Name of hit song",
    "artist": "Name of Artist"
  },
  ...
]
```
<a href="https://billboard100api.glitch.me/1969/Feb">Example (GET /1969/Feb)</a>

---
```
// Get the #1 song for a given day
GET /:year/:month/:day

// Returns:
{
  "name": "Name of hit song",
  "artist": "Name of Artist",
  "startDate": "(first day on chart, in UTC)",
  "endDate": "(last day on chart, in UTC)"
}
```
<a href="https://billboard100api.glitch.me/1969/Feb/14">Example (GET /1969/Feb/14)</a>

---