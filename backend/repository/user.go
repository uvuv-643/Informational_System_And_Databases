package repository

import (
	"log"
	"main/initialize"
	"main/model"
)

type RoleRow struct {
	Name string
}

func IsUserAdmin(user model.User) bool {
	queryResult := initialize.DB.Raw("SELECT name FROM select_user_roles(?)", user.ID)
	rows, err := queryResult.Rows()
	if err != nil {
		return false
	}
	for rows.Next() {
		var r RoleRow
		err := rows.Scan(&r.Name)
		if err != nil {
			log.Fatal(err)
		}
		if r.Name == "admin" {
			return true
		}
	}
	return false
}
