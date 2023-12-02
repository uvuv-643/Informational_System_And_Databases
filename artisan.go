package main

import (
	"fmt"
	"log"
	"main/kernel"
	"os"
	"strconv"
)

func main() {

	kernel.Init()
	if len(os.Args) < 2 {
		fmt.Println("Usage: \"artisan <command> [arguments]\"")
		return
	}
	arg1 := os.Args[1]
	if arg1 == "make:migration" {
		arg2 := os.Args[2]
		kernel.CreateMigration(arg2)
	} else if arg1 == "migrate:fresh" {
		kernel.RunMigrations()
	} else if arg1 == "db:seed" {
		arg2 := os.Args[2]
		arg3 := os.Args[3]
		count, err := strconv.Atoi(arg3)
		if err != nil {
			log.Fatal("Cannot read count of elements")
		}
		kernel.CreateSeeder(arg2, count, os.Args[4:]...)
	} else if arg1 == "db:triggers" {
		kernel.CreateFunctions()
	} else if arg1 == "db:indexes" {
		kernel.CreateIndexes()
	}

}
