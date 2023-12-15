package controllers

import (
	"github.com/gin-gonic/gin"
	"log"
	"main/initialize"
)

type DistrictRow struct {
	Id    int32  `json:"id"`
	Title string `json:"title"`
}

type DistrictRows struct {
	Row []DistrictRow `json:"districts"`
}

func Districts(c *gin.Context) {

	execResult := initialize.DB.Raw("SELECT id, name as title FROM districts")
	rows, _ := execResult.Rows()
	var rowSlice []DistrictRow
	for rows.Next() {
		var r DistrictRow
		err := rows.Scan(&r.Id, &r.Title)
		if err != nil {
			log.Fatal(err)
		}
		rowSlice = append(rowSlice, r)
	}
	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}
	c.Header("Access-Control-Allow-Origin", "*")
	c.JSON(200, DistrictRows{rowSlice})

}
