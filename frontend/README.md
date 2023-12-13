# Required API for frontend


### ```POST``` /api/login
Accepts

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


### ```POST``` /api/register
Accepts

```json
{
  "email": "string",
  "name": "string",
  "password": "string",
  "district_id": 1
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


### ```GET``` /api/orders

В случае, если запрос сделал администратор, возвращает все заказы. Если пользователь, то только его.

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

Проверяем расположение всех фото, считаем их среднее значение.
Если фото были сделаны в различных местах, возвращаем ошибку.

Accepts

```json
{
  "orderId": "string",
  "description": "string"
}
```

Returns

```json
{
  "success": true,
  "message": "string"
}
```

### ```POST``` /api/votings/{orderId}

Запускаем голосование по заданной заявке

Returns

```json
{
  "success": true,
  "message": "string"
}
```

### ```POST``` /api/jobs/{orderId}

Добавляем работу к уже созданной заявке

Accepts

```json
{
  "users": [1, 6, 9]
}
```

Returns

```json
{
  "success": true,
  "message": "string"
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
