package controllers

import (
	"github.com/gin-gonic/gin"
	"main/initialize"
	"net/http"
)

func CreateJob(c *gin.Context) {
	queryResult := initialize.DB.Raw("INSERT INTO jobs ( order_id, job_status_id, started_at, finished_at) VALUES (?, 2, NOW(), NULL)", c.Param("orderId"))
	_, err := queryResult.Rows()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Вы не можете редактировать данную заявку",
		})
		return
	}
	c.JSON(200, gin.H{
		"success": true,
	})
}
