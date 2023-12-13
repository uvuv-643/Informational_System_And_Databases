# Api for frontend


### /api/login
Accept

```json
{
  "email": "string",
  "password": "string"
}
```

Returns
```json
{
  "user": {
    "name" : "string",
    "email" : "string",
    "district" : "string",
    "roles" : ["0 - user, 1 - admin"]
  }
}
```
