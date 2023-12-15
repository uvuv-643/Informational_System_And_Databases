package utils

import (
	"bufio"
	"context"
	"github.com/jackc/pgx/v5"
	"log"
	"os"
	"strings"
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

func ReadSQLFile(filePath string) ([]string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var queries []string
	var query strings.Builder

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.TrimSpace(line) == "" || strings.HasPrefix(line, "--") {
			// Skip empty lines and comments
			continue
		}

		query.WriteString(line)

		// Check if the line ends with a semicolon indicating the end of the query
		if strings.HasSuffix(strings.TrimSpace(line), ";") {
			queries = append(queries, query.String())
			query.Reset()
		}
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return queries, nil
}
