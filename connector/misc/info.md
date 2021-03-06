# Confuence Team Calendars

Information collected from the Internet.

## REST API
- [Official documentation](https://docs.atlassian.com/ConfluenceServer/rest/6.9.1/)
- [Basic auth](https://developer.atlassian.com/cloud/confluence/basic-auth-for-rest-apis/)
- [Authenticating REST requests](https://developer.atlassian.com/server/fisheye-crucible/authenticating-rest-requests/)

## Endpoints
- [Atlassian community and a JSON endpoint for calendars](https://community.atlassian.com/t5/Answers-Developer-Questions/Team-Calendar-list-events-API/qaq-p/532723)
- [Undocumented calendar REST API](https://jira.atlassian.com/browse/CONFSERVER-51003)
- [Calendar endpoints doc in XML](https://gist.github.com/juanpaulo/0d48653173e589901bb2c48ff7e79ba7)
- [Calendar events endpoints doc in XML](https://gist.github.com/juanpaulo/cdc3a40a43c57eab12afd8abb406c5a5)

## Auth
- [Using Basic auth](https://community.atlassian.com/t5/Confluence-questions/Authenticating-Confluence-using-Basic-authentication/qaq-p/62019)

### Sample URLs
- Get current global spaces
```html
https://HOST/rest/api/space?limit=100&type=global&status=current
```
- Get space calendars
```html
https://HOST/rest/calendar-services/1.0/calendar/subcalendars.json?calendarContext=spaceCalendars&viewingSpaceKey=KEY
```
- Get calendar events
```html
https://HOST/rest/calendar-services/1.0/calendar/events.json?subCalendarId=SUBCALENDARID&start=2018-04-27T00:00:00Z&end=2018-08-07T00:00:00Z
```
