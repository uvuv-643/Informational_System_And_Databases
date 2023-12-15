package routes

import (
	"github.com/gin-gonic/gin"
	"main/controllers"
	"main/middleware"
)

func Init(r *gin.Engine) {

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.Static("/uploads", "./uploads")
	r.POST("/api/register", controllers.Register)
	r.POST("/api/login", controllers.Login)
	r.POST("/api/logout", controllers.Logout)
	r.POST("/api/photo/:orderId/:photoId", middleware.RequireAuth, controllers.UploadPhoto)
	r.DELETE("/api/photo/:orderId/:photoId", middleware.RequireAuth, controllers.DeleteImage)
	r.GET("/api/user", middleware.RequireAuth, controllers.User)
	r.GET("/api/orders", middleware.RequireAuth, controllers.Orders)
	r.POST("/api/order", middleware.RequireAuth, controllers.CreateOrder)
	r.GET("/api/order/:id", middleware.RequireAuth, middleware.RequireAdmin, controllers.Order)
	r.DELETE("/api/order/:orderId", middleware.RequireAuth, controllers.DeleteOrder)
	r.POST("/api/voting/:orderId", middleware.RequireAuth, middleware.RequireAdmin, controllers.ChangeVotingStatus)
	r.POST("/api/vote/:votingId/:vote", middleware.RequireAuth, controllers.MakeVote)
	r.POST("/api/job/:orderId", middleware.RequireAuth, middleware.RequireAdmin, controllers.CreateJob)
	r.GET("/api/votings/:id", middleware.RequireAuth, controllers.Voting)
	r.GET("/api/votings", middleware.RequireAuth, controllers.Votings)
	r.GET("/api/districts", controllers.Districts)
	r.GET("/api/admins", middleware.RequireAuth, middleware.RequireAdmin, controllers.GetUsersAdmins)

	r.Run()

}
