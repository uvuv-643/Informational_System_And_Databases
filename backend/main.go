package main

import (
	"github.com/gin-gonic/gin"
	"main/kernel"
	"main/routes"
)

func main() {

	kernel.Init()

	r := gin.Default()
	routes.Init(r)
	err := r.Run(":80")
	if err != nil {
		return
	}

}
