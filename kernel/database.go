package kernel

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/davecgh/go-spew/spew"
	"log"
	"main/utils"
	"os"
	"strings"
	"time"
)

const databaseMigrationsPath = "database/migrations/"
const databaseSeedersPath = "database/seeders/"

type databaseMigrationsJson struct {
	Names []string
}

type databaseSeedersJson struct {
	Names []string
}

func CreateMigration(title string) {

	migrationTitle := time.Now().Format("2006_01_02_15_04_05") + "-" + title
	migrationPath := databaseMigrationsPath + migrationTitle + "/"

	// create folder for current migrations
	if err := os.Mkdir(migrationPath, os.ModePerm); err != nil {
		log.Fatal(fmt.Sprint("createMigration [mkdir]: ", err))
	}

	// create up.sql
	fileUp, errorUp := os.Create(migrationPath + "up.sql")
	if errorUp != nil {
		log.Fatal(fmt.Sprint("createMigration [create file up.sql]: ", errorUp))
	}

	// create down.sql
	fileDown, errorDown := os.Create(migrationPath + "down.sql")
	if errorDown != nil {
		log.Fatal(fmt.Sprint("createMigration [create file down.sql]: ", errorDown))
	}

	// read all the migrations from json
	fileMigrations, errorMigrations := os.ReadFile(databaseMigrationsPath + "migrations.json")
	if errorMigrations != nil {
		log.Fatal(fmt.Sprint("createMigration [open file migrations.json]: ", errorMigrations))
	}

	// try to parse migration file
	var currentMigrationsJson = databaseMigrationsJson{nil}
	errUnmarshal := json.Unmarshal(fileMigrations, &currentMigrationsJson)
	if errUnmarshal != nil {
		currentMigrationsJson = databaseMigrationsJson{make([]string, 0)}
		log.Print("createMigration [created migration.json data]")
	}

	// write new migration to file
	currentMigrationsJson.Names = append(currentMigrationsJson.Names, migrationTitle)
	encryptedJson, _ := json.Marshal(&currentMigrationsJson)
	errorWrite := os.WriteFile(databaseMigrationsPath+"migrations.json", encryptedJson, os.ModePerm)
	if errorWrite != nil {
		log.Fatal(fmt.Sprint("createMigration [unmarshal file]: ", errorWrite))
	}

	// close created files
	defer fileDown.Close()
	defer fileUp.Close()

}

func RunMigrations() {

	conn := Conn

	fileMigrations, errorMigrations := os.ReadFile(databaseMigrationsPath + "migrations.json")
	if errorMigrations != nil {
		log.Fatal(fmt.Sprint("runMigrations [open file migrations.json]: ", errorMigrations))
	}

	var currentMigrationsJson = databaseMigrationsJson{nil}
	errUnmarshal := json.Unmarshal(fileMigrations, &currentMigrationsJson)
	if errUnmarshal != nil {
		log.Fatal("runMigrations [cannot run migrations - error with migrations.json]")
	}

	downQueries := make([]string, 0)
	upQueries := make([]string, 0)

	for _, value := range currentMigrationsJson.Names {
		migrationPath := databaseMigrationsPath + value + "/"
		downQuery, downError := os.ReadFile(migrationPath + "down.sql")
		upQuery, upError := os.ReadFile(migrationPath + "up.sql")
		if downError != nil {
			log.Fatal("runMigrations [cannot run migrations - error down.sql]", downError)
		}
		if upError != nil {
			log.Fatal("runMigrations [cannot run migrations - error up.sql]", upError)
		}
		downQueries = append(downQueries, string(downQuery))
		upQueries = append(upQueries, string(upQuery))
	}

	utils.ReverseStrings(downQueries)

	for _, query := range downQueries {
		_, err := conn.Exec(context.Background(), query)
		if err != nil {
			log.Println("runMigrations [cannot drop table] ", err)
		}
	}

	for _, query := range upQueries {
		_, err := conn.Exec(context.Background(), query)
		if err != nil {
			log.Println("runMigrations [cannot up table] ", err)
		}
	}

}

func CreateSeeder(title string, count int, columns ...string) {

	seederTitle := time.Now().Format("2006_01_02_15_04_05") + "-" + title + ".sql"
	seederPath := databaseSeedersPath + seederTitle

	// create seeder
	fileUp, errorUp := os.Create(seederPath)
	if errorUp != nil {
		log.Fatal(fmt.Sprint("createSeeder [create file seed.sql]: ", errorUp))
	}

	// read all the seeders from json
	fileMigrations, errorMigrations := os.ReadFile(databaseSeedersPath + "seeders.json")
	if errorMigrations != nil {
		log.Fatal(fmt.Sprint("createSeeder [open file seeders.json]: ", errorMigrations))
	}

	// try to parse seeders from json file
	var currentSeedersJson = databaseSeedersJson{nil}
	errUnmarshal := json.Unmarshal(fileMigrations, &currentSeedersJson)
	if errUnmarshal != nil {
		currentSeedersJson = databaseSeedersJson{make([]string, 0)}
		log.Print("createSeeder [created seeders.json data]")
	}

	// write new migration to file
	currentSeedersJson.Names = append(currentSeedersJson.Names, seederTitle)
	encryptedJson, _ := json.Marshal(&currentSeedersJson)
	errorWrite := os.WriteFile(databaseSeedersPath+"seeders.json", encryptedJson, os.ModePerm)
	if errorWrite != nil {
		log.Fatal(fmt.Sprint("createSeeder [unmarshal file]: ", errorWrite))
	}

	for i := 0; i < count; i++ {
		emptyValues := make([]string, 0)
		for _ = range columns {
			emptyValues = append(emptyValues, "\"\"")
		}
		_, err := fileUp.WriteString(spew.Sprintf(
			"INSERT INTO %s(%s) VALUES (\n\t%s\n);\n\n",
			title,
			strings.Join(columns[:], ", "),
			strings.Join(emptyValues, ", "),
		))
		if err != nil {
			log.Fatal(fmt.Sprint("createSeeder [cannot write to file file]: ", err))
		}
	}

	// close created files
	defer fileUp.Close()

}
