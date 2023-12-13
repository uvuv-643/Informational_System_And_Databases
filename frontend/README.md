# Required API for frontend


### ```GET``` /api/login
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


### ```GET``` /api/orders/my
Accept

```json
{
  "page": 1,
  "orderBy": "desc",
  "orderByColumn": "description"
}
```

Returns

```json
{
  "orders": [
    {
      "description": "string",
      "location": {
        "street": "string",
        "house": "string",
        "district": "string"
      },
      "voting": {
        "id": 1,
        "status": "string",
        "for": 15,
        "against": 7
      },
      "jobs": [
        {
          "id": 1,
          "status": "в процессе"
        }
      ],
      "photos": [
        {
          "path": "string"
        }
      ]
    }
  ]
}
```



### ```POST``` /api/photos/{orderId}/{photoId}

Returns

```json
{
  "success": true
}
```


### ```DELETE``` /api/photos/{orderId}/{photoId}

Returns

```json
{
  "success": true
}
```


