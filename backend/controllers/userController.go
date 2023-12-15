package controllers

import (
	"github.com/gin-gonic/gin"
	"log"
	"main/initialize"
)

type UserRow struct {
	Id   int32  `json:"id"`
	Name string `json:"name"`
}

type UsersRows struct {
	Row []UserRow `json:"users"`
}

func GetUsersAdmins(c *gin.Context) {

	execResult := initialize.DB.Raw("SELECT id, name FROM select_admins()")
	rows, _ := execResult.Rows()
	var rowSlice []UserRow
	for rows.Next() {
		var r UserRow
		err := rows.Scan(&r.Id, &r.Name)
		if err != nil {
			log.Fatal(err)
		}
		rowSlice = append(rowSlice, r)
	}
	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}
	c.JSON(200, UsersRows{rowSlice})
}
