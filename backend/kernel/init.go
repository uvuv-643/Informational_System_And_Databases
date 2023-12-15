package kernel

import (
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
	"log"
	"main/initialize"
)

var Conn *pgx.Conn

func Init() {

	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}
	initialize.DataBase()

}
