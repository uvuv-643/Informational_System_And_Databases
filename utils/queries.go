package utils

import (
	"context"
	"github.com/jackc/pgx/v5"
	"log"
)

func SelectIdsFromTable(Conn *pgx.Conn, tableName string) []int {
	query := "SELECT id FROM " + tableName
	rows, err := Conn.Query(context.Background(), query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var rowSlice []int
	for rows.Next() {
		var r int
		err := rows.Scan(&r)
		if err != nil {
			log.Fatal(err)
		}
		rowSlice = append(rowSlice, r)
	}
	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}
	return rowSlice
}
