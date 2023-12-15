package controllers

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
	"main/initialize"
	"main/model"
	"main/repository"
	"math"
	"math/rand"
	"net/http"
)

type OrdersRows struct {
	Orders []model.OrderRow `json:"orders"`
}

func Orders(c *gin.Context) {

	user, _ := c.Get("user")
	userModel := user.(model.User)
	var queryResult *gorm.DB
	if repository.IsUserAdmin(userModel) {
		queryResult = initialize.DB.Raw("SELECT id, description FROM orders")
	} else {
		queryResult = initialize.DB.Raw("SELECT id, description FROM orders WHERE user_id = ?", userModel.ID)
	}
	rows, err := queryResult.Rows()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Невозможно получить заказы из базы1",
		})
		return
	}
	var rowSlice = make([]model.OrderRow, 0)
	for rows.Next() {
		var r model.OrderRow
		err := rows.Scan(&r.Id, &r.Description)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Невозможно получить заказы из базы2",
			})
			return
		}
		err = repository.FillOrderInformation(&r)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		rowSlice = append(rowSlice, r)
	}

	c.JSON(200, OrdersRows{rowSlice})

}

func Order(c *gin.Context) {

	var queryResult *gorm.DB
	queryResult = initialize.DB.Raw("SELECT id, description FROM orders WHERE id=?", c.Param("id"))
	rows, err := queryResult.Rows()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Невозможно получить заказы из базы1",
		})
		return
	}
	var rowSlice = make([]model.OrderRow, 0)
	for rows.Next() {
		var r model.OrderRow
		err := rows.Scan(&r.Id, &r.Description)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Невозможно получить заказы из базы2",
			})
			return
		}
		err = repository.FillOrderInformation(&r)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		rowSlice = append(rowSlice, r)
	}

	var response struct {
		Order model.OrderRow `json:"order"`
	}
	if len(rowSlice) > 0 {
		response.Order = rowSlice[0]
		c.JSON(200, response)
		return
	} else {
		c.JSON(404, gin.H{
			"message": "not found",
		})
	}

}

type Coords struct {
	Longitude float64
	Latitude  float64
}

func CreateOrder(c *gin.Context) {
	var data struct {
		OrderId     string `json:"orderId"`
		Description string `json:"description"`
	}
	var rowSlice []Coords
	if c.BindJSON(&data) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Убедитесь, что все данные введены корректно",
		})
		return
	}
	execResult := initialize.DB.Raw("SELECT longitude, latitude FROM photos WHERE temp_order=?", data.OrderId)
	rows, _ := execResult.Rows()
	for rows.Next() {
		var r Coords
		err := rows.Scan(&r.Longitude, &r.Latitude)
		if err != nil {
			log.Fatal(err)
		}
		rowSlice = append(rowSlice, r)
	}
	middle := Coords{
		0.0, 0.0,
	}
	for _, row := range rowSlice {
		middle.Longitude += row.Longitude
		middle.Latitude += row.Latitude
	}
	middle.Longitude /= float64(len(rowSlice))
	middle.Latitude /= float64(len(rowSlice))

	// 0.5km
	maxAvailableDist := 0.0006
	for _, row := range rowSlice {
		if math.Abs(row.Latitude-middle.Latitude) > maxAvailableDist || math.Abs(row.Longitude-middle.Longitude) > maxAvailableDist {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Фотографии были сделаны в разных местах.",
			})
			return
		}
	}

	user, _ := c.Get("user")
	userModel := user.(model.User)

	execResult = initialize.DB.Raw("SELECT create_order(?, ?, ?, ?, ?)", data.Description, userModel.ID, "N\\A", rand.Intn(3)+1, data.OrderId)
	_, err := execResult.Rows()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Ошибки при заполнении заказа. Убедитесь, что вы ввели все поля корректно.",
		})
		return
	}

	c.JSON(200, gin.H{
		"success": true,
	})

}

func DeleteOrder(c *gin.Context) {
	execResult := initialize.DB.Raw("DELETE FROM orders WHERE id=?", c.Param("orderId"))
	_, err := execResult.Rows()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Ошибки при заполнении заказа. Убедитесь, что вы ввели все поля корректно.",
		})
		return
	}
	c.JSON(200, gin.H{
		"success": true,
	})
	return
}
