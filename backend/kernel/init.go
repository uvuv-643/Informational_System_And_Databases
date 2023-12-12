package kernel

import (
	"context"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
	"log"
	"os"
)

var Conn *pgx.Conn

func Init() {

	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}

	var err error = nil
	Conn, err = pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal("Init [unable to connect] ", err)
	}

}
