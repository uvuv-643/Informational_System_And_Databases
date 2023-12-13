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


### ```POST``` /api/order/

Accept

```json
{
  "orderId": "string",
  "description": "string"
}
```

Returns

```json
{
  "success": true
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

### ```GET``` /api/votings/


Returns

```json
{
  "voting": {
    "id": 15,
    "status": "завершено | голос | string",
    "for": 1,
    "against": 2,
    "order": {
      "description": "string"
    }  
  }
}
```



### ```GET``` /api/votings/{votingId}

Получить информацию по голосованиям в текущем районе пользователя. 
Нужно вернуть заявки в текущем районе пользователя.

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


### ```GET``` /api/districts

Returns

```json
{
  "districts": [
    {
      "id": 12,
      "title": "string"
    }
  ]
}
```
